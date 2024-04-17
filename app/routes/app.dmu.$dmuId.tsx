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
  const formData = await request.formData();
  const formDmu = formData.get("dmu");
  const dmu = JSON.parse(formDmu?.toString()!) as {
    dmu: DiscountMetafieldUnion;
    discount: Discount;
    metafieldDefinition: MetafieldDefinition;
    metafieldValue: MetafieldValue;
  };
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
  const dmu: {
    dmu: DiscountMetafieldUnion;
    discount: Discount;
    metafieldDefinition: MetafieldDefinition;
    metafieldValue: MetafieldValue;
  } = useLoaderData();

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
