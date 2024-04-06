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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  // load MetafieldDefinitions
  let metafieldDefinitions = await prisma.metafieldDefinition.findMany();
  console.log("YYYYYYYYYYYYYYYYYy");
  console.log(metafieldDefinitions);

  const discounts = await prisma.discount.findMany();
  const optionedDiscounts = discounts.map((discount) => {
    return {
      label: discount.title,
      value: discount.id,
    };
  });

  console.log(discounts);

  const optionedMetafieldDefinitions = metafieldDefinitions.map(
    (definition) => {
      return {
        label: `${definition.name} - ${definition.namespace}.${definition.key}`,
        value: definition.id,
      };
    },
  );

  return { optionedDiscounts, optionedMetafieldDefinitions };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  // get the data
  // update the discount by adding to the metafields
  console.log("submit");
  console.log(
    (await request.formData()).forEach((value, key) => {
      console.log(key, value);
    }),
  );

  // persistDiscountMetafield({ formData: request.formData() });

  return json({});
};

export default function NewDiscountPage() {
  const navigate = useNavigate();
  const submit = useSubmit();
  const [metafieldField, setMetafieldField] = useState("");
  const [namespaceKey, setNamespaceKeyField] = useState("");
  const [discount, setDiscount] = useState("");
  const loadedData: {
    optionedDiscounts: { label: string; value: string }[];
    optionedMetafieldDefinitions: { label: string; value: string }[];
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
                    { metafieldField, discount, namespaceKey },
                    { replace: true, method: "POST" },
                  );
                }}
              >
                <FormLayout>
                  <Select
                    label="Metafield Name - Namespace.Key"
                    options={
                      loadedData.optionedMetafieldDefinitions as SelectOption[]
                    }
                    onChange={(val) => setNamespaceKeyField(val)}
                    value={namespaceKey}
                  />
                  <TextField
                    label="Enter a metafield value and pray"
                    value={metafieldField}
                    onChange={setMetafieldField}
                    autoComplete="off"
                  />
                  <Select
                    label="Discount"
                    options={loadedData.optionedDiscounts as SelectOption[]}
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
