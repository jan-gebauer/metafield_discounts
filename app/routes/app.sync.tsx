import { Item, Metafield } from "@prisma/client";
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
  console.log(response);
  let responseJson = await response.json();
  console.log(responseJson.data.products.pageInfo.hasNextPage);
  console.log(responseJson.data.products.edges);

  // here is what will happen
  // make the initial call
  // have a loop
  // save the data to an array
  // keep checking for next page
  // if there is one, call the thing again
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

  console.log(items.length);

  items.forEach((item: any) => {
    console.log(item.node.metafields);
  });

  // persist the data in the database
  const itemsWithMetafields = items.filter(
    (item: any) => item.node.metafields.edges.length > 0,
  );
  console.log(itemsWithMetafields.length);
  const processedItems: { item: Item; metafields: Metafield[] }[] =
    itemsWithMetafields.map((edge: any) => {
      console.log(edge.node);
      const item: Item = {
        id: edge.node.id,
        title: edge.node.title,
        handle: edge.node.handle,
      };
      const metafieldNodes = edge.node.metafields.edges;
      console.log(metafieldNodes);
      const metafields = metafieldNodes.map((metafield: any) => {
        return metafield.node;
      });
      console.log(metafields);
      return {
        item: item,
        metafields: metafields,
      };
    });

  console.log(processedItems);
  processedItems.forEach(
    async (processedItem: { item: Item; metafields: Metafield[] }) => {
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
