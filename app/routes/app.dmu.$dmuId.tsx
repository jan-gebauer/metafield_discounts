import {
  Discount,
  DiscountMetafieldUnion,
  MetafieldDefinition,
} from "@prisma/client";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { BlockStack, Button, Card, Layout, Page } from "@shopify/polaris";
import { RestResources } from "@shopify/shopify-api/rest/admin/2024-01";
import { getDiscountWithId } from "graphql/discountQueries";
import { requestDmuToggle } from "graphql/dmuQueries";
import { getMetafieldDefinition } from "graphql/metafieldQueries";
import { getProductsWithMetafields } from "graphql/productQueries";
import { AdminApiContext } from "node_modules/@shopify/shopify-app-remix/build/ts/server/clients";
import { authenticate } from "~/shopify.server";

export type DmuPackage = {
  dmu: DiscountMetafieldUnion;
  discount: Discount;
  metafieldDefinition: MetafieldDefinition;
  metafieldValue: string;
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { admin } = await authenticate.admin(request);

  console.log("XXXXXXXXXXx");

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

  const discountJson = await discountResponse.json();

  const discount = {
    id: discountJson.data.automaticDiscountNode.id,
    title: discountJson.data.automaticDiscountNode.automaticDiscount.title,
  };

  const metafieldDefinitionResponse = await getMetafieldDefinition({
    admin: admin,
    id: dmu?.metafield_definition_id!,
  });
  const metafieldDefinitionJson = await metafieldDefinitionResponse.json();

  const metafieldDefinition = {
    id: metafieldDefinitionJson.data.metafieldDefinition.id,
    name: metafieldDefinitionJson.data.metafieldDefinition.name,
    namespace: metafieldDefinitionJson.data.metafieldDefinition.namespace,
    key: metafieldDefinitionJson.data.metafieldDefinition.key,
  };

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
    console.log("deleting");
    toggleDmu(admin, dmuPackage, false);
    await prisma.dmu.delete({
      where: {
        id: dmuPackage.dmu.id,
      },
    });
    return redirect("/app/discounts");
  }
  if (request.method == "POST") {
    console.log("toggling");

    toggleDmu(admin, dmuPackage, !dmuPackage.dmu.active);

    return json({});
  }
};

export default function DiscountMetafield() {
  const dmuPackage: DmuPackage = useLoaderData();

  const submit = useSubmit();

  const formData = new FormData();
  formData.append("dmu", JSON.stringify(dmuPackage));

  return (
    <Page>
      <ui-title-bar title="DMU" />
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
  const productsResponse = await getProductsWithMetafields({
    admin: admin,
    nextCursorParam: null,
  });

  const productsJson = await productsResponse.json();

  let metafieldsWithProduct: {
    productId: string;
    metafieldDefinitionNamespace: string;
    metafieldDefinitionKey: string;
    metafieldValue: string;
  }[] = [];
  productsJson.data.products.edges.forEach((edge: any) => {
    edge.node.metafields.edges.forEach((mEdge: any) => {
      metafieldsWithProduct.push({
        productId: edge.node.id,
        metafieldDefinitionNamespace: mEdge.node.namespace,
        metafieldDefinitionKey: mEdge.node.key,
        metafieldValue: mEdge.node.value,
      });
    });
  });

  const processedMetafields = metafieldsWithProduct.filter(
    (metafield: {
      productId: string;
      metafieldDefinitionNamespace: string;
      metafieldDefinitionKey: string;
      metafieldValue: string;
    }) => {
      return (
        metafield.metafieldDefinitionNamespace ==
          dmuPackage.metafieldDefinition.namespace &&
        metafield.metafieldDefinitionKey ==
          dmuPackage.metafieldDefinition.key &&
        metafield.metafieldValue == dmuPackage.metafieldValue
      );
    },
  );

  const productsToAdd = desiredState
    ? []
    : processedMetafields.map((metafield) => metafield.productId);
  const productsToRemove = desiredState
    ? processedMetafields.map((metafield) => metafield.productId)
    : [];
  await requestDmuToggle(
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
};
