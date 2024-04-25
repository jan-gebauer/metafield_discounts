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
import { loadDmus } from "./app.discounts/loadDiscountMetafields";
import { getStoreId } from "graphql/storeQueries";

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
  const { admin } = await authenticate.admin(request);

  const storeRequest = await getStoreId({
    admin: admin,
  });
  const storeJson = await storeRequest.json();
  const storeId = storeJson.data.shop.id;

  return await loadDmus(storeId);
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
              <Button onClick={() => navigate(`/app/discounts/new`)}>
                Create a discount
              </Button>
              <Outlet />
              <DmusOverviewTable data={discountMetafields} url={"/app/dmu"} />
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
