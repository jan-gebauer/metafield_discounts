import { Outlet, useNavigate } from "@remix-run/react";
import { BlockStack, Button, Card, Layout, Page } from "@shopify/polaris";

export default function SyncDatabasesPage() {
  const navigate = useNavigate();

  return (
    <Page>
      <ui-title-bar title="Database sync" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <Button onClick={() => navigate("/app/sync/products")}>
                Sync products
              </Button>
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
