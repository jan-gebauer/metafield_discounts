import { MetafieldDefinition } from "@prisma/client";
import { ActionFunctionArgs } from "@remix-run/node";
import { useSubmit } from "@remix-run/react";
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
import { useState } from "react";
import { authenticate } from "~/shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  const minimumDate = (await request.formData()).get("minimumDate");

  if (!minimumDate) {
    return "";
  }

  const response = await getMetafieldsUpdatedAfter({
    admin,
    query: minimumDate.toString(),
    nextCursorParam: null,
  });
  let responseJson = await response.json();

  let metafieldDefinitionsGraphQL: any[] = [];
  metafieldDefinitionsGraphQL = metafieldDefinitionsGraphQL.concat(
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
    metafieldDefinitionsGraphQL = metafieldDefinitionsGraphQL.concat(
      responseJson.data.metafieldDefinitions.edges,
    );
  }

  const metafieldDefinitions: MetafieldDefinition[] =
    metafieldDefinitionsGraphQL.map((edge: any) => {
      return {
        id: edge.node.id,
        name: edge.node.name,
        namespace: edge.node.namespace,
        key: edge.node.key,
      };
    });

  const databaseReadyDefinitions: MetafieldDefinition[] = (
    await Promise.all(
      metafieldDefinitions.map(async (definition) => {
        const foundDefinition = await prisma.metafieldDefinition.findUnique({
          where: {
            id: definition.id,
          },
        });
        if (foundDefinition) {
          return null;
        }
        return definition;
      }),
    )
  ).filter((def): def is MetafieldDefinition => (def ? true : false));

  databaseReadyDefinitions.forEach(async (definition: MetafieldDefinition) => {
    const res = await prisma.metafieldDefinition.create({
      data: {
        ...definition,
      },
    });
  });

  return "success";
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
