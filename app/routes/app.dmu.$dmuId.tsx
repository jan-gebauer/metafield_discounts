import {
  Discount,
  DiscountMetafieldUnion,
  MetafieldDefinition,
  MetafieldValue,
} from "@prisma/client";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { BlockStack, Button, Card, Layout, Page } from "@shopify/polaris";
import { getDiscountsUpdatedAfterWithItems } from "graphql/discountQueries";
import { toggleDmu } from "graphql/dmuQueries";
import { authenticate } from "~/shopify.server";

export type DmuPackage = {
  dmu: DiscountMetafieldUnion;
  discount: Discount;
  metafieldDefinition: MetafieldDefinition;
  metafieldValue: MetafieldValue;
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  await authenticate.admin(request);

  const dmu = await prisma.discountMetafieldUnion.findUnique({
    where: { id: params.dmuId },
  });

  if (!dmu) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  console.log(dmu);

  const discount = await prisma.discount.findUnique({
    where: {
      id: dmu.discount_id,
    },
  });
  const metafieldDefinition = await prisma.metafieldDefinition.findUnique({
    where: {
      id: dmu.metafieldDefinitionId,
    },
  });
  const metafieldValue = await prisma.metafieldValue.findUnique({
    where: {
      id: dmu.metafield_value_id,
    },
  });

  return { dmu, discount, metafieldDefinition, metafieldValue };
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const formDmu = formData.get("dmu");
  const dmu = JSON.parse(formDmu?.toString()!) as DmuPackage;

  const resp = await getDiscountsUpdatedAfterWithItems({
    admin: admin,
    nextCursorParam: null,
    query: "",
  });
  const respJsonDiscount = await resp.json();

  respJsonDiscount.data.automaticDiscountNodes.edges.forEach((edge: any) => {
    console.log(edge.node.automaticDiscount);
    if (edge.node.automaticDiscount) {
      console.log(edge.node.automaticDiscount.customerGets);
    }
  });
  if (request.method == "DELETE") {
    console.log("deleting");
    await prisma.discountMetafieldUnion.delete({
      where: {
        id: dmu.dmu.id,
      },
    });
    return redirect("/app/discounts");
  }
  if (request.method == "POST") {
    console.log("toggling");
    console.log(dmu.discount.title);
    const products = await prisma.item.findMany({
      where: {
        Metafield: {
          every: {
            metafieldDefinitionId: dmu.metafieldDefinition.id,
            metafield_value_id: dmu.metafieldValue.id,
          },
        },
      },
    });
    const productsToAdd = dmu.dmu.active
      ? []
      : products.map((product) => product.id);
    const productsToRemove = dmu.dmu.active
      ? products.map((product) => product.id)
      : [];
    console.log(productsToAdd);
    console.log(productsToRemove);
    const result = await toggleDmu(
      admin,
      dmu.discount.id,
      productsToAdd,
      productsToRemove,
    );
    const respJson = await result.json();
    console.log(respJson.data);
    await prisma.discountMetafieldUnion.update({
      data: {
        active: !dmu.dmu.active,
      },
      where: {
        id: dmu.dmu.id,
      },
    });
  }
  return json({});
};

export default function DiscountMetafield() {
  const dmu: DmuPackage = useLoaderData();

  const submit = useSubmit();

  const formData = new FormData();
  formData.append("dmu", JSON.stringify(dmu));

  return (
    <Page>
      <ui-title-bar title="DMU" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              Discount title: {dmu.discount.title}
              <br />
              Metafield namespace.key: {dmu.metafieldDefinition.namespace}.
              {dmu.metafieldDefinition.key}
              <br />
              Metafield value: {dmu.metafieldValue.value}
              <br />
              {dmu.dmu.active ? "Active" : "Inactive"}
              <Button
                onClick={() => {
                  submit(formData, { method: "POST" });
                }}
              >
                {dmu.dmu.active ? "Disable" : "Enable"}
              </Button>
              <Button
                onClick={() => {
                  submit(formData, { method: "DELETE" });
                }}
              >
                Delete
              </Button>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
