import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import {
  Outlet,
  useFetcher,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import {
  Card,
  Layout,
  Page,
  BlockStack,
  Button,
  Checkbox,
} from "@shopify/polaris";
import { authenticate } from "~/shopify.server";
import DmusOverviewTable from "./app.discounts/DmusOverviewTable";
import { loadDiscountMetafields } from "./app.discounts/loadDiscountMetafields";

export type DiscountMetafields = {
  dmuId: string;
  discount: string;
  metafieldNamespaceKey: string;
  value: string;
  active: boolean;
};

export const loader = async ({
  request,
}: LoaderFunctionArgs): Promise<DiscountMetafields[]> => {
  await authenticate.admin(request);

  return await loadDiscountMetafields();
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  // submit the discount

  return json({});
};

export default function ProductsPage() {
  const navigate = useNavigate();
  const discountMetafields: DiscountMetafields[] = useLoaderData();

  return (
    <Page>
      <ui-title-bar title="Additional page" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              {/* <Form onSubmit={() => {
                                // submit({ bindingMount: binidingMountField }, { replace: true, method: "POST" })
                            }}>
                                <FormLayout>
                                    <TextField label="Target metafield" value={metafieldField} onChange={setMetafieldField} autoComplete="off" />
                                    <Button submit>Create a discount for metafield</Button>
                                </FormLayout>
                            </Form> */}
              <Button onClick={() => navigate(`/app/discounts/new`)}>
                Create a discount
              </Button>
              {/* how do I update the number of items with discout? Using a loader? */}
              {/* Do I make a new  */}

              {/* Everything above is probably wrong. Here's what you want:
                                overview page is the main thing
                                it has a button to create metafield-discount, that pop us a form and this is another page
                                -> this page redirects you to that applied discount info, e.g. what it is and the items that have it
                                On the metafield-discount page, you have the option to delete that record, which takes to you an overview
                                On the overview page, you also have a list of all the metafield-discounts
                                
                                This way, you can still have delete as an action on the overview page
                                AND have create on the new metafield-discount page as an action
                                -> refresh might not even be necessary as the overview allegedly might revalidate on the action submission
                            */}
              <Outlet />
              <DmusOverviewTable
                data={discountMetafields}
                url={"/app/dmu"}
                toggleHandler={() => console.log("toggle")}
                deleteHandler={() => console.log("delete")}
              />
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
