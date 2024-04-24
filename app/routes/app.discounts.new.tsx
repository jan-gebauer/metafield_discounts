import { Discount } from "@prisma/client";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import {
  Card,
  Layout,
  Page,
  BlockStack,
  Button,
  Form,
  FormLayout,
  TextField,
  Select,
  SelectOption,
} from "@shopify/polaris";
import { useState } from "react";
import { authenticate } from "~/shopify.server";
import { persistDiscountMetafield } from "./app.discounts/persistDiscountMetafield";
import { getAutomaticDiscounts } from "graphql/discountQueries";
import { getMetafieldDefinitionsOwnerProduct } from "graphql/metafieldQueries";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  const discountResponse = await getAutomaticDiscounts({
    admin: admin,
    nextCursorParam: null,
  });

  const discountJson = await discountResponse.json();
  const discounts = discountJson.data.automaticDiscountNodes.edges.map(
    (edge: any) => {
      return { value: edge.node.id, label: edge.node.automaticDiscount.title };
    },
  );

  const metafieldDefinitionsResponse =
    await getMetafieldDefinitionsOwnerProduct({
      admin: admin,
      nextCursorParam: null,
    });

  const metafieldDefinitionsJson = await metafieldDefinitionsResponse.json();
  const metafieldDefinitions =
    metafieldDefinitionsJson.data.metafieldDefinitions.edges.map(
      (edge: any) => {
        return {
          label: `${edge.node.name} - ${edge.node.namespace}.${edge.node.key}`,
          value: edge.node.id,
        };
      },
    );

  // This is for when I feel like improving this even further
  // const metafieldsResponse = await getMetafieldsFromProducts({
  //   admin: admin,
  //   nextCursorParam: null,
  // });
  // const metafieldsJson = await metafieldsResponse.json();
  // const metafields = metafieldsJson.data.products.edges.flatMap((edge: any) => {
  //   return edge.node.metafields.edges;
  // });

  return { discounts, metafieldDefinitions };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  // get the data
  // update the discount by adding to the metafields
  console.log("submit");

  const formData = await request.formData();
  formData.forEach((value, key) => {
    console.log(key, value);
  });
  const result = persistDiscountMetafield({ formData: formData });

  return result;
};

export default function NewDiscountPage() {
  const navigate = useNavigate();
  const submit = useSubmit();
  const [metafieldValue, setMetafieldValue] = useState("");
  const [metafieldDefinition, setMetafieldDefinition] = useState("");
  const [discount, setDiscount] = useState("");
  const loadedData: {
    discounts: { label: string; value: string }[];
    metafieldDefinitions: { label: string; value: string }[];
  } = useLoaderData();

  console.log(loadedData);
  return (
    <Page>
      <ui-title-bar title="Additional page" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <Button onClick={() => navigate(`/app/discounts`)}>
                Stop creation
              </Button>
              <Form
                onSubmit={() => {
                  submit(
                    {
                      metafieldValue,
                      discount,
                      metafieldDefinition,
                    },
                    { replace: true, method: "POST" },
                  );
                }}
              >
                <FormLayout>
                  <Select
                    label="Metafield Name - Namespace.Key"
                    options={loadedData.metafieldDefinitions as SelectOption[]}
                    onChange={(val) => setMetafieldDefinition(val)}
                    value={metafieldDefinition}
                  />
                  <TextField
                    label="Enter a metafield value and pray"
                    value={metafieldValue}
                    onChange={setMetafieldValue}
                    autoComplete="off"
                  />
                  <Select
                    label="Discount"
                    options={loadedData.discounts as SelectOption[]}
                    onChange={setDiscount}
                    value={discount}
                  />
                  <Button submit>Create a discount for metafield</Button>
                </FormLayout>
              </Form>
              <Outlet />
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
