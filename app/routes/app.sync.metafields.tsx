import { Item, Metafield, MetafieldDefinition } from "@prisma/client";
import { ActionFunctionArgs } from "@remix-run/node";
import { Outlet, useNavigate, useSubmit } from "@remix-run/react";
import {
  BlockStack,
  Button,
  Card,
  Form,
  FormLayout,
  Layout,
  Page,
  TextField,
} from "@shopify/polaris";
import { getMetafieldsUpdatedAfter } from "graphql/metafieldQueries";
import { getProductsUpdateAfter } from "graphql/productQueries";
import { useState } from "react";
import { authenticate } from "~/shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  console.log("test");
  const minimumDate = (await request.formData()).get("minimumDate");
  console.log(minimumDate);

  if (!minimumDate) {
    return "";
  }

  const response = await getMetafieldsUpdatedAfter({
    admin,
    query: minimumDate.toString(),
    nextCursorParam: null,
  });
  console.log(response);
  let responseJson = await response.json();
  console.log(responseJson);
  console.log(responseJson.data.metafieldDefinitions.pageInfo.hasNextPage);
  console.log(responseJson.data.metafieldDefinitions.edges);

  let metafieldDefinitions: any[] = [];
  metafieldDefinitions = metafieldDefinitions.concat(
    responseJson.data.metafieldDefinitions.edges,
  );
  while (responseJson.data.metafieldDefinitions.pageInfo.hasNextPage) {
    const response = await getMetafieldsUpdatedAfter({
      admin,
      query: minimumDate.toString(),
      nextCursorParam:
        responseJson.data.metafieldDefinitions.pageInfo.endCursor,
    });
    responseJson = await response.json();
    metafieldDefinitions = metafieldDefinitions.concat(
      responseJson.data.metafieldDefinitions.edges,
    );
  }

  console.log(metafieldDefinitions.length);

  metafieldDefinitions.forEach((definition: any) => {
    console.log(definition.node);
  });

  const databaseReadyDefinitions: MetafieldDefinition[] =
    metafieldDefinitions.map((edge: any) => {
      return {
        id: edge.node.id,
        metafieldName: edge.node.name,
        metafieldNamespace: edge.node.namespace,
        metafieldKey: edge.node.key,
      };
    });

  console.log(databaseReadyDefinitions);
  databaseReadyDefinitions.forEach(async (definition: MetafieldDefinition) => {
    const res = await prisma.metafieldDefinition.create({
      data: {
        ...definition,
      },
    });
    console.log(res);
  });

  return "blahblah";
};

export default function SyncMetafieldsPage() {
  const submit = useSubmit();
  const [minimumDate, setMinimumDate] = useState("");

  return (
    <Page>
      <ui-title-bar title="Metafields sync" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <Form
                onSubmit={() => {
                  submit({ minimumDate }, { replace: true, method: "POST" });
                }}
              >
                <FormLayout>
                  <TextField
                    label="Starting date for sync"
                    value={minimumDate}
                    onChange={setMinimumDate}
                    autoComplete="off"
                    type="date"
                  />
                  <Button submit>Sync metafields from the given date</Button>
                </FormLayout>
              </Form>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
