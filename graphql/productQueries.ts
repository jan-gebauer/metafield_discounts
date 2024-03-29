import { RestResources } from "@shopify/shopify-api/rest/admin/2024-01";
import { AdminApiContext } from "node_modules/@shopify/shopify-app-remix/build/ts/server/clients";

export const getProducts = async ({
  admin,
  nextCursorParam,
}: {
  admin: AdminApiContext<RestResources>;
  nextCursorParam: string | null;
}) => {
  console.log("YYYYYYYYYYYYYYYYYYYYYYYYYYYYYY");
  let response = await admin.graphql(
    `#graphql
      query products($nextCursor: String) {
        products(first: 10, reverse: true, after: $nextCursor) {
          edges {
            node {
              id
              title
              handle
              # metafields(first: 3) {
              #   edges {
              #     node {
              #       id
              #       namespace
              #       key
              #       value
              #       type
              #       description
              #     }
              #   }
              # }
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

  console.log(response.statusText);
  return response;
};

export const getProductsLastPage = async ({
  admin,
  previousCursorParam,
}: {
  admin: any;
  previousCursorParam: string | null;
}) => {
  console.log("ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ");
  const response = await admin.graphql(
    `#graphql
      query products($previousCursor: String) {
        products(last: 10, reverse: true, before: $previousCursor) {
          edges {
            node {
              id
              title
              handle
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
        previousCursor: previousCursorParam,
      },
    },
  );
  console.log(response.statusText);
  return response;
};

export const getProduct = async ({
  admin,
  nextCursorParam,
}: {
  admin: any;
  nextCursorParam: string | null;
}) => {
  return await admin.graphql(
    `#graphql
      query products($nextCursor: String) {
        products(first: 2, reverse: true, after: $nextCursor) {
          edges {
            node {
              id
              title
              handle
              metafields(first: 3) {
                edges {
                  node {
                    id
                    namespace
                    key
                    value
                    type
                    description
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

export const getProductLastPage = async ({
  admin,
  previousCursorParam,
}: {
  admin: any;
  previousCursorParam: string | null;
}) => {
  return await admin.graphql(
    `#graphql
      query products($previousCursor: String) {
        products(last: 1, reverse: true, before: $previousCursor) {
          edges {
            node {
              id
              title
              handle
              metafields(first: 3) {
                edges {
                  node {
                    id
                    namespace
                    key
                    value
                    type
                    description
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
        previousCursor: previousCursorParam,
      },
    },
  );
};

export const getProductsUpdateAfter = async ({
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
      # query products($nextCursor: String, $query: String) {
      query products($nextCursor: String) {
        products(first: 2, reverse: true, after: $nextCursor, query: "updated_at:>=01-01-2022") {
          edges {
            node {
              id
              title
              handle
              metafields(first: 3) {
                edges {
                  node {
                    id
                    namespace
                    key
                    value
                    type
                    description
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
        query: query,
      },
    },
  );
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
