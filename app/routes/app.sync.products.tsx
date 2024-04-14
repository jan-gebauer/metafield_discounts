import { Item, Metafield, MetafieldDefinition } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
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
import { getProductsUpdateAfter } from "graphql/productQueries";
import { useState } from "react";
import { authenticate } from "~/shopify.server";

export type MetafieldQL = {
  node: {
    id: string;
    namespace: string;
    key: string;
    value: string;
    type: string;
    description: string | null;
  };
};

export type MetafieldItemless = {
  id: string;
  metafieldDefinitionId: string;
  metafield_value_id: string;
  type: string;
  description: string;
};

export type MetafieldAndDefinition = {
  metafield: MetafieldQL;
  metafieldDefinition: MetafieldDefinition;
};

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
  const processedItems: { item: Item; metafields: MetafieldItemless[] }[] =
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
          }): metafieldAndDefinition is MetafieldAndDefinition => {
            return metafieldAndDefinition.metafield !== null;
          },
        );

        const metafields: MetafieldItemless[] = await Promise.all(
          filteredMetafields.map(
            async (metafieldAndDefinition: {
              metafield: MetafieldQL;
              metafieldDefinition: MetafieldDefinition;
            }): Promise<MetafieldItemless> => {
              let metafieldValue = await prisma.metafieldValue.findUnique({
                where: {
                  value: metafieldAndDefinition.metafield.node.value,
                },
              });

              if (!metafieldValue) {
                try {
                  metafieldValue = await prisma.metafieldValue.create({
                    data: {
                      value: metafieldAndDefinition.metafield.node.value,
                    },
                  });
                } catch (error: any) {
                  if (error.code === "P2002") {
                    metafieldValue = await prisma.metafieldValue.findFirst({
                      where: {
                        value: metafieldAndDefinition.metafield.node.value,
                      },
                    });
                  } else {
                    throw error;
                  }
                }
              }

              return {
                id: metafieldAndDefinition.metafield.node.id,
                metafieldDefinitionId:
                  metafieldAndDefinition.metafieldDefinition.id,
                metafield_value_id: metafieldValue!.id,
                type: metafieldAndDefinition.metafield.node.type,
                description:
                  metafieldAndDefinition.metafield.node.description || "",
              };
            },
          ),
        );
        return {
          item: item,
          metafields: metafields,
        };
      }),
    );

  const processedItemsWithMetafields = processedItems.filter(
    (processedItem: { item: Item; metafields: MetafieldItemless[] }) => {
      return processedItem.metafields.length > 0;
    },
  );
  processedItemsWithMetafields.forEach(
    async (processedItem: { item: Item; metafields: MetafieldItemless[] }) => {
      try {
        const res = await prisma.item.create({
          data: {
            ...processedItem.item,
            Metafield: {
              create: [...processedItem.metafields],
            },
          },
          include: {
            Metafield: true,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  );

  return "blahblah";
};

export default function SyncProductsPage() {
  const submit = useSubmit();
  const [minimumDate, setMinimumDate] = useState("");

  return (
    <Page>
      <ui-title-bar title="Products sync" />
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
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
