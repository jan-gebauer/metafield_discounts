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
  FormLayout,
  Grid,
} from "@shopify/polaris";
import { createProductWithMetafield as createProductWithTextMetafield } from "graphql/productQueries";
import { useState } from "react";
import { authenticate } from "~/shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  const metafieldKey = "bindingMount";
  const requestBody = (await request.text()) || ""
  const params = new URLSearchParams(requestBody)
  const metafieldValue = params.get(metafieldKey)
  if (!metafieldValue) {
    return json({
      product: null
    })
  }

  const color = ["Crimson", "Cyan", "Emerald", "Pink"][
    Math.floor(Math.random() * 4)
  ];
  const response = await createProductWithTextMetafield({ admin, color, metafieldKey, metafieldValue });
  const responseJson = await response.json();

  return json({
    product: responseJson.data?.productCreate?.product,
  });
}



export default function ProductsPage() {
  const submit = useSubmit()
  const [binidingMountField, setBindingMountField] = useState("");

  return (
    <Page>
      <ui-title-bar title="Additional page" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <Form onSubmit={() => {
                submit({ bindingMount: binidingMountField }, { replace: true, method: "POST" })
              }}>
                <FormLayout>
                  <TextField label="Binding mount" value={binidingMountField} onChange={setBindingMountField} autoComplete="off" />
                  <Button submit>Generate a product with metafield</Button>
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
