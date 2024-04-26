import { RestResources } from "@shopify/shopify-api/rest/admin/2024-01";
import { AdminApiContext } from "node_modules/@shopify/shopify-app-remix/build/ts/server/clients";

export const getAutomaticDiscounts = async ({
  admin,
  nextCursorParam,
}: {
  admin: AdminApiContext<RestResources>;
  nextCursorParam: string | null;
}) => {
  return await admin.graphql(
    `#graphql
      query automaticDiscountNodes($nextCursor: String) {
        automaticDiscountNodes(first: 10, reverse: true, after: $nextCursor) {
          edges {
            node {
              id
              automaticDiscount {
                ... on DiscountAutomaticBasic {
                  title
                }
              }
            }
          },
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          
        }
      }`,
    {
      variables: {
        nextCursor: nextCursorParam,
      },
    },
  );
};

export const getDiscountWithId = async ({
  admin,
  id,
}: {
  admin: AdminApiContext<RestResources>;
  id: string;
}) => {
  const response = await admin.graphql(
    `#graphql
      query automaticDiscountNode($id: ID!) {
        automaticDiscountNode(id: $id) {
          ... on DiscountAutomaticNode {
            id
            automaticDiscount {
              ... on DiscountAutomaticBasic {
                title
              }
            }
          }
        }
      }`,
    {
      variables: {
        id: id,
      },
    },
  );
  const json = await response.json();
  return json.data.automaticDiscountNode;
};
