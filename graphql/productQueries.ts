import { RestResources } from "@shopify/shopify-api/rest/admin/2024-01";
import { AdminApiContext } from "node_modules/@shopify/shopify-app-remix/build/ts/server/clients";

export const getProducts = async ({
  admin,
  nextCursorParam,
}: {
  admin: AdminApiContext<RestResources>;
  nextCursorParam: string | null;
}) => {
  console.log("YYYYYYYYYYYYYYYYYYYYYYYYYYYYYY")
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

  console.log(response.statusText)
  return response
};

export const getProductsLastPage = async ({
  admin,
  previousCursorParam,
}: {
  admin: any;
  previousCursorParam: string | null;
}) => {
  console.log("ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ")
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
  console.log(response.statusText)
  return response
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
