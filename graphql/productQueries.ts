import { RestResources } from "@shopify/shopify-api/rest/admin/2024-01";
import { AdminApiContext } from "node_modules/@shopify/shopify-app-remix/build/ts/server/clients";

export const getProductsOnlyIds = async ({
  admin,
  nextCursorParam,
}: {
  admin: AdminApiContext<RestResources>;
  nextCursorParam: string | null;
}) => {
  return await admin.graphql(
    `#graphql
      query products($nextCursor: String) {
        products(first: 20, reverse: true, after: $nextCursor) {
          edges {
            node {
              id
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

export const getMetafieldsFromProduct = async ({
  admin,
  nextCursorParam = null,
  productId,
}: {
  admin: AdminApiContext<RestResources>;
  nextCursorParam: string | null;
  productId: String;
}) => {
  const query = `#graphql
          query product($id: ID!, $nextCursor: String) {
            product(id: $id) {
              metafields(first: 20, after: $nextCursor) {
                edges {
                  node {
                    namespace
                    key
                    value
                  }
                },
                pageInfo {
                  hasNextPage
                  endCursor
                }
              }
            }
        }
      `;
  return await admin.graphql(query, {
    variables: { id: productId, nextCursor: nextCursorParam },
  });
};

export const createProductWithMetafield = async ({
  admin,
  color,
  metafieldKey,
  metafieldValue,
}: {
  admin: AdminApiContext<RestResources>;
  color: string;
  metafieldKey: string;
  metafieldValue: string;
}) => {
  return await admin.graphql(
    `#graphql
      mutation createProductMetafields($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            metafields(first: 3) {
              edges {
                node {
                  id
                  key
                  value
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        input: {
          title: `${color} Snowboard`,
          metafields: [
            {
              namespace: "test_data",
              key: metafieldKey,
              type: "single_line_text_field",
              value: metafieldValue,
            },
          ],
        },
      },
    },
  );
};

export const getProductsWithMetafields = async ({
  admin,
  nextCursorParam,
}: {
  admin: AdminApiContext<RestResources>;
  nextCursorParam: string | null;
}) => {
  return await admin.graphql(
    `#graphql
      query products($nextCursor: String) {
        products(first: 10, reverse: true, after: $nextCursor) {
          edges {
            node {
              id
              metafields(first: 10) {
                edges {
                  node {
                    id
                    namespace
                    key
                    value
                  }
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

export const getFurtherMetafields = async ({
  admin,
  nextCursorParam,
}: {
  admin: AdminApiContext<RestResources>;
  nextCursorParam: string | null;
}) => {
  return await admin.graphql(
    `#graphql
      query products($nextCursor: String) {
        products(first: 10, reverse: true, after: $nextCursor) {
          edges {
            node {
              id
              metafields(first: 10) {
                edges {
                  node {
                    id
                    namespace
                    key
                    value
                  }
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
