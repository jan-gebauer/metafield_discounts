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
import { getProductsUpdateAfter } from "graphql/productQueries";
import { useState } from "react";
import { authenticate } from "~/shopify.server";

type MetafieldQL = {
  node: {
    id: string;
    namespace: string;
    key: string;
    value: string;
    type: string;
    description: string | null;
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  console.log("test");
  const minimumDate = (await request.formData()).get("minimumDate");
  console.log(minimumDate);

  if (!minimumDate) {
    return "";
  }

  const response = await getProductsUpdateAfter({
    admin,
    query: minimumDate.toString(),
    nextCursorParam: null,
  });
  let responseJson = await response.json();

  let items: any[] = [];
  items = items.concat(responseJson.data.products.edges);
  while (responseJson.data.products.pageInfo.hasNextPage) {
    const response = await getProductsUpdateAfter({
      admin,
      query: minimumDate.toString(),
      nextCursorParam: responseJson.data.products.pageInfo.endCursor,
    });
    responseJson = await response.json();
    items = items.concat(responseJson.data.products.edges);
  }

  const itemsWithMetafields = items.filter(
    (item: any) => item.node.metafields.edges.length > 0,
  );
  const processedItems: { item: Item; metafields: Metafield[] }[] =
    await Promise.all(
      itemsWithMetafields.map(async (edge: any) => {
        const item: Item = {
          id: edge.node.id,
          title: edge.node.title,
          handle: edge.node.handle,
        };
        const metafieldNodes: MetafieldQL[] = edge.node.metafields.edges;
        const possibleMetafields: {
          metafield: MetafieldQL | null;
          metafieldDefinition: MetafieldDefinition | null;
        }[] = await Promise.all(
          metafieldNodes.map(
            async (
              metafield: MetafieldQL,
            ): Promise<{
              metafield: MetafieldQL | null;
              metafieldDefinition: MetafieldDefinition | null;
            }> => await getMetafieldAndDefinition(metafield),
          ),
        );

        const filteredMetafields: {
          metafield: MetafieldQL;
          metafieldDefinition: MetafieldDefinition;
        }[] = possibleMetafields.filter(
          (metafieldAndDefinition: {
            metafield: MetafieldQL | null;
            metafieldDefinition: MetafieldDefinition | null;
          }): metafieldAndDefinition is {
            metafield: MetafieldQL;
            metafieldDefinition: MetafieldDefinition;
          } => {
            return metafieldAndDefinition.metafield !== null;
          },
        );

        // filter out metafields with null?
        // continue?
        const metafields: Metafield[] = filteredMetafields.map(
          (metafieldAndDefinition: {
            metafield: MetafieldQL;
            metafieldDefinition: MetafieldDefinition;
          }): any => {
            return {
              id: metafieldAndDefinition.metafield.node.id,
              metafieldDefinitionId:
                metafieldAndDefinition.metafieldDefinition.id,
              value: metafieldAndDefinition.metafield.node.value,
              type: metafieldAndDefinition.metafield.node.type,
              description: metafieldAndDefinition.metafield.node.description,
            };
          },
        );
        // console.log(metafields);
        return {
          item: item,
          metafields: metafields,
        };
      }),
    );

  console.log("processed items");
  console.log(processedItems);
  // const itemsWithMetafields = processedItems.filter(
  //   (processedItem: { item: Item; metafields: Metafield[] }) => {
  //     return processedItem.metafields.length > 0;
  //   },
  // );
  const processedItemsWithMetafields = processedItems.filter(
    (processedItem: { item: Item; metafields: Metafield[] }) => {
      return processedItem.metafields.length > 0;
    },
  );
  processedItemsWithMetafields.forEach(
    async (processedItem: { item: Item; metafields: Metafield[] }) => {
      // console.log(processedItem.item);
      // console.log(processedItem.metafields);
      const res = await prisma.item.create({
        data: {
          id: processedItem.item.id,
          title: processedItem.item.title,
          handle: processedItem.item.handle,
          Metafield: {
            create: processedItem.metafields,
          },
        },
        include: {
          Metafield: true,
        },
      });
      console.log(res);
    },
  );

  return "blahblah";
};

export default function SyncDatabasesPage() {
  const submit = useSubmit();
  const navigate = useNavigate();
  const [minimumDate, setMinimumDate] = useState("");

  return (
    <Page>
      <ui-title-bar title="Database sync" />
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
                  <Button submit>Sync products from the given date</Button>
                </FormLayout>
              </Form>
              <Button onClick={() => navigate("/app/sync/discounts")}>
                Sync discounts
              </Button>
              <Button onClick={() => navigate("/app/sync/metafields")}>
                Sync metafields
              </Button>
              <Outlet />
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

async function getMetafieldAndDefinition(metafield: any): Promise<{
  metafield: MetafieldQL | null;
  metafieldDefinition: MetafieldDefinition | null;
}> {
  console.log(metafield.node);
  const metafieldDefinition = await prisma.metafieldDefinition.findFirst({
    where: {
      namespace: metafield.node.namespace,
      key: metafield.node.key,
    },
  });

  if (metafieldDefinition) {
    return { metafield, metafieldDefinition };
  }
  return { metafield: null, metafieldDefinition: null };
}
