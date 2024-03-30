import { Discount, Item, Metafield } from "@prisma/client";
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
import { getDiscountsUpdatedAfter } from "graphql/discountQueries";
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

  const response = await getDiscountsUpdatedAfter({
    admin,
    query: minimumDate.toString(),
    nextCursorParam: null,
  });
  console.log(response);
  let responseJson = await response.json();
  console.log(responseJson.data);
  console.log(responseJson.data.automaticDiscountNodes.edges);

  // here is what will happen
  // make the initial call
  // have a loop
  // save the data to an array
  // keep checking for next page
  // if there is one, call the thing again
  let items: any[] = [];
  items = items.concat(responseJson.data.automaticDiscountNodes.edges);
  while (responseJson.data.automaticDiscountNodes.pageInfo.hasNextPage) {
    const response = await getDiscountsUpdatedAfter({
      admin,
      query: minimumDate.toString(),
      nextCursorParam:
        responseJson.data.automaticDiscountNodes.pageInfo.endCursor,
    });
    responseJson = await response.json();
    items = items.concat(responseJson.data.automaticDiscountNodes.edges);
  }

  // console.log(items.length);

  items.forEach((item: any) => {
    console.log(item.node);
    console.log(item.node.automaticDiscount);
    console.log(item.node.automaticDiscount !== undefined);
    console.log(Object.keys(item.node.automaticDiscount).length > 0);
  });

  const automaticDiscounts = items.filter(
    (item: any) => Object.keys(item.node.automaticDiscount).length > 0,
  );

  console.log(automaticDiscounts);
  // persist the data in the database
  const databaseReadyDiscounts: Discount[] = automaticDiscounts.map(
    (edge: any) => {
      return {
        id: edge.node.id,
        title: edge.node.automaticDiscount.title,
        summary: edge.node.automaticDiscount.summary,
      };
    },
  );

  console.log(databaseReadyDiscounts);
  databaseReadyDiscounts.forEach(async (discount: Discount) => {
    // try for unique constraint
    const found = await prisma.discount.findUnique({
      where: {
        id: discount.id,
      },
    });
    if (!found) {
      const res = await prisma.discount.create({
        data: {
          id: discount.id,
          title: discount.title,
          summary: discount.summary,
        },
      });
      console.log("result");
      console.log(res);
    } else {
      console.log(found);
    }
  });

  return "blahblah";
};

export default function SyncDiscountsPage() {
  const submit = useSubmit();
  const [minimumDate, setMinimumDate] = useState("");

  return (
    <Page>
      <ui-title-bar title="Discount Database sync" />
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
                  <Button submit>Sync discounts from the given date</Button>
                </FormLayout>
              </Form>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
