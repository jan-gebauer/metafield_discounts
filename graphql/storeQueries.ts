import { RestResources } from "@shopify/shopify-api/rest/admin/2024-01";
import { AdminApiContext } from "node_modules/@shopify/shopify-app-remix/build/ts/server/clients";

export const getStoreId = async ({
  admin,
}: {
  admin: AdminApiContext<RestResources>;
}) => {
  return await admin.graphql(
    `#graphql
      query {
        shop {
          id
        }
      }`,
  );
};
