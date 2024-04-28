import { useEffect } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Outlet,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { getStoreId } from "graphql/storeQueries";
import { loadDmusHumanReadable } from "./app.discounts/loadDiscountMetafields";
import DmusOverviewTable from "./app.discounts/DmusOverviewTable";

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

  return await loadDmusHumanReadable(admin, storeId);
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  return json({});
};

export default function Index() {
  const nav = useNavigation();
  const actionData = useActionData<typeof action>();
  const isLoading =
    ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";

  const navigate = useNavigate();
  const discountMetafields: DiscountMetafields[] = useLoaderData();

  return (
    <Page>
      <ui-title-bar title="Metafield Discount Manager"></ui-title-bar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="300">
                <Button onClick={() => navigate(`/app/new-discount`)}>
                  Create a discount
                </Button>
                <Outlet />
                <DmusOverviewTable data={discountMetafields} url={"/app/dmu"} />
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
