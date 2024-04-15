import {
  Discount,
  DiscountMetafieldUnion,
  MetafieldDefinition,
  MetafieldValue,
} from "@prisma/client";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { BlockStack, Button, Card, Layout, Page } from "@shopify/polaris";
import { authenticate } from "~/shopify.server";

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
  if (request.method == "DELETE") {
    console.log("deleting");
  }
  if (request.method == "POST") {
    console.log("toggling");
  }
  return json({});
};

export default function DiscountMetafield() {
  const dmu: {
    dmu: DiscountMetafieldUnion;
    discount: Discount;
    metafieldDefinition: MetafieldDefinition;
    metafieldValue: MetafieldValue;
  } = useLoaderData();

  console.log(dmu);

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
              <Form method="POST">
                <Button submit>{dmu.dmu.active ? "Disable" : "Enable"}</Button>
              </Form>
              <Form method="DELETE">
                <Button submit>Delete</Button>
              </Form>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
