import { Dmu } from "@prisma/client";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import {
  BlockStack,
  Button,
  Card,
  InlineGrid,
  Layout,
  Page,
  Spinner,
  Text,
} from "@shopify/polaris";
import { RestResources } from "@shopify/shopify-api/rest/admin/2024-01";
import { getDiscountWithId } from "graphql/discountQueries";
import { requestDmuToggle } from "graphql/dmuQueries";
import { getMetafieldDefinition } from "graphql/metafieldQueries";
import {
  getMetafieldsFromProduct,
  getProductsOnlyIds,
} from "graphql/productQueries";
import { AdminApiContext } from "node_modules/@shopify/shopify-app-remix/dist/ts/server/clients";
import { authenticate } from "~/shopify.server";
import prisma from "~/db.server";

export type DmuPackage = {
  dmu: Dmu;
  discount: { id: string; title: string };
  metafieldDefinition: {
    id: any;
    name: any;
    namespace: any;
    key: any;
  };
  metafieldValue: string;
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { admin } = await authenticate.admin(request);

  const dmu = await prisma.dmu.findUnique({
    where: { id: params.dmuId },
  });

  if (!dmu) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const discountResponse = await getDiscountWithId({
    admin: admin,
    id: dmu?.discount_id!,
  });

  const discount = {
    id: discountResponse.id,
    title: discountResponse.automaticDiscount.title,
  };

  const metafieldDefinition = await getMetafieldDefinition({
    admin: admin,
    id: dmu?.metafield_definition_id!,
  });

  return {
    dmu: dmu,
    discount: discount,
    metafieldDefinition: metafieldDefinition,
    metafieldValue: dmu.metafield_value,
  };
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const formDmu = formData.get("dmu");
  const dmuPackage = JSON.parse(formDmu?.toString()!) as DmuPackage;

  if (request.method == "DELETE") {
    await toggleDmu(admin, dmuPackage, false);
    await prisma.dmu.delete({
      where: {
        id: dmuPackage.dmu.id,
      },
    });
    return redirect("/app");
  }
  if (request.method == "POST") {
    try {
      const result = toggleDmu(admin, dmuPackage, !dmuPackage.dmu.active);
      return result;
    } catch (e) {
      console.log(e);
    }
  }
};

export default function DiscountMetafield() {
  const dmuPackage: any = useLoaderData();
  const toggleResult: { result: string; message: string } | undefined =
    useActionData();

  const submit = useSubmit();

  const formData = new FormData();
  formData.append("dmu", JSON.stringify(dmuPackage));

  const navigation = useNavigation();

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              Discount title: {dmuPackage.discount.title}
              <br />
              Metafield namespace.key:{" "}
              {dmuPackage.metafieldDefinition.namespace}.
              {dmuPackage.metafieldDefinition.key}
              <br />
              Metafield value: {dmuPackage.metafieldValue}
              <br />
              {dmuPackage.dmu.active ? "Active" : "Inactive"}
              <Button
                onClick={() => {
                  submit(formData, { method: "POST" });
                }}
              >
                {dmuPackage.dmu.active ? "Disable" : "Enable"}
              </Button>
              <Button
                onClick={() => {
                  submit(formData, { method: "DELETE" });
                }}
              >
                Disable and Delete
              </Button>
              <div
                style={{
                  display: "grid",
                  placeItems: "center",
                  height: "100%",
                }}
              >
                {navigation.state == "submitting" ? (
                  <Spinner
                    accessibilityLabel="Spinner for your action"
                    size="large"
                  />
                ) : null}
                {toggleResult && toggleResult.result == "unsuccessful" ? (
                  <Text as="span" tone="critical">
                    {toggleResult.message}
                  </Text>
                ) : null}
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

const toggleDmu = async (
  admin: AdminApiContext<RestResources>,
  dmuPackage: DmuPackage,
  desiredState: boolean,
) => {
  const productsIdsResponse = await getProductsOnlyIds({
    admin: admin,
    nextCursorParam: null,
  });

  let productsIdsJson = await productsIdsResponse.json();

  let productsIds = productsIdsJson.data.products.edges.map((edge: any) => {
    return edge.node.id;
  });

  while (productsIdsJson.data.products.pageInfo.hasNextPage) {
    const productsIdsResponse = await getProductsOnlyIds({
      admin: admin,
      nextCursorParam: productsIdsJson.data.products.pageInfo.endCursor,
    });
    productsIdsJson = await productsIdsResponse.json();
    productsIds = productsIds.concat(
      productsIdsJson.data.products.edges.map((edge: any) => {
        return edge.node.id;
      }),
    );
  }

  let metafieldSet: Set<string> = new Set();
  for (const productId of productsIds) {
    const metafieldsResponse = await getMetafieldsFromProduct({
      admin: admin,
      nextCursorParam: null,
      productId: productId,
    });
    const metafieldsJson = await metafieldsResponse.json();
    for (const edge of metafieldsJson.data.product.metafields.edges) {
      const metafieldPackage = {
        productId: productId,
        metafieldDefinitionNamespace: edge.node.namespace,
        metafieldDefinitionKey: edge.node.key,
        metafieldValue: edge.node.value,
      };
      metafieldSet.add(JSON.stringify(metafieldPackage));
    }
  }
  const stringedMetafields = [...metafieldSet];
  let metafields: {
    productId: string;
    metafieldDefinitionNamespace: string;
    metafieldDefinitionKey: string;
    metafieldValue: string;
  }[] = stringedMetafields.map((metafield) => {
    return JSON.parse(metafield);
  });

  const filteredMetafields = metafields.filter((metafield) => {
    return (
      metafield.metafieldDefinitionNamespace ==
        dmuPackage.metafieldDefinition.namespace &&
      metafield.metafieldDefinitionKey == dmuPackage.metafieldDefinition.key &&
      metafield.metafieldValue == dmuPackage.metafieldValue
    );
  });
  metafields = filteredMetafields;

  const productsToAdd = desiredState
    ? []
    : metafields.map((metafield) => metafield.productId);
  const productsToRemove = desiredState
    ? metafields.map((metafield) => metafield.productId)
    : [];

  if (!productsToAdd.length && !productsToRemove.length) {
    return {
      result: "unsuccessful",
      message:
        "No products with the expected metafield value, check if metafield value is correct.",
    };
  }

  const requestResult = await requestDmuToggle(
    admin,
    dmuPackage.discount.id,
    productsToAdd,
    productsToRemove,
  );

  await prisma.dmu.update({
    data: {
      active: desiredState,
    },
    where: {
      id: dmuPackage.dmu.id,
    },
  });

  return {
    result: "successful",
    message: "DMU toggled successfully",
  };
};
