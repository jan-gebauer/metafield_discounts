import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, useNavigate, useSubmit } from "@remix-run/react";
import {
  Card,
  Layout,
  Page,
  Text,
  BlockStack,
  Button,
  TextField,
  Form,
} from "@shopify/polaris";
import { useState } from "react";
import { authenticate } from "~/shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);


  const requestBody = (await request.text()) || ""
  const params = new URLSearchParams(requestBody)
  const actionedCustomField = params.get("bindingMount")

  const color = ["Crimson", "Cyan", "Emerald", "Pink"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation createProductMetafields($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            metafields(first: 3) {
              edges {
                node {
                  id
                  key
                  value
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        input: {
          title: `${color} Snowboard`,
          metafields: [{
            namespace: "test_data",
            key: "binding_mount",
            type: "single_line_text_field",
            value: actionedCustomField
          }]
        },
      },
    }
  );
  const responseJson = await response.json();

  return json({
    product: responseJson.data?.productCreate?.product,
  });
}



export default function ProductsPage() {
  const navigate = useNavigate()
  const submit = useSubmit()
  const [binidingMountField, setBindingMountField] = useState("");

  return (
    <Page>
      <ui-title-bar title="Additional page" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <Text as="p" variant="bodyMd">
                This is a test.
              </Text>
              <Button onClick={() => navigate(`/app/products/foo`)}>Get products</Button>
              <Button onClick={() => navigate('/app/products')}>Reset</Button>
              <Form onSubmit={() => {
                submit({ bindingMount: binidingMountField }, { replace: true, method: "POST" })
                // setCustomField("")
              }}>
                <TextField label="Binding mount" value={binidingMountField} onChange={setBindingMountField} autoComplete="off" />
                <Button submit>Generate a product with metafield</Button>
                <Button onClick={() => navigate('/app/products/persist')}>Persist</Button>
              </Form>
              <Outlet />
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
