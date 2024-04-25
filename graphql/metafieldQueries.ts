import { RestResources } from "@shopify/shopify-api/rest/admin/2024-01";
import { AdminApiContext } from "node_modules/@shopify/shopify-app-remix/build/ts/server/clients";

export const getMetafieldDefinitionsUpdatedAfter = async ({
  admin,
  nextCursorParam,
  query,
}: {
  admin: any;
  nextCursorParam: string | null;
  query: string;
}) => {
  return await admin.graphql(
    `#graphql
      query metafieldDefinitions($nextCursor: String) {
        metafieldDefinitions(first: 2, reverse: true, after: $nextCursor, ownerType: PRODUCT) {
          edges {
            node {
              id
              name
              namespace
              key
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
        query: query,
      },
    },
  );
};

export const getMetafieldDefinitionsOwnerProduct = async ({
  admin,
  nextCursorParam,
}: {
  admin: AdminApiContext<RestResources>;
  nextCursorParam: string | null;
}) => {
  return await admin.graphql(
    `#graphql
      query metafieldDefinitions($nextCursor: String) {
        metafieldDefinitions(first: 10, reverse: true, after: $nextCursor, ownerType: PRODUCT) {
          edges {
            node {
              id
              name
              namespace
              key
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

export const getMetafieldDefinition = async ({
  admin,
  id,
}: {
  admin: AdminApiContext<RestResources>;
  id: String;
}) => {
  return await admin.graphql(
    `#graphql
      query metafieldDefinition($id: ID!) {
        metafieldDefinition(id: $id) {
          id,
          namespace,
          key,
          name
        }
      }`,
    {
      variables: {
        id: id,
      },
    },
  );
};
