import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, useNavigate, useSubmit } from "@remix-run/react";
import {
  Card,
  Layout,
  Page,
  BlockStack,
  Button,
  Form,
  FormLayout,
  TextField,
} from "@shopify/polaris";
import { useState } from "react";
import { authenticate } from "~/shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  // submit the discount

  return json({});
};

export default function NewDiscountPage() {
  const navigate = useNavigate();
  const submit = useSubmit();
  const [metafieldField, setMetafieldField] = useState("");

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
                    { bindingMount: metafieldField },
                    { replace: true, method: "POST" },
                  );
                }}
              >
                <FormLayout>
                  <TextField
                    label="Target metafield"
                    value={metafieldField}
                    onChange={setMetafieldField}
                    autoComplete="off"
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
