import { RestResources } from "@shopify/shopify-api/rest/admin/2024-01";
import { AdminApiContext } from "node_modules/@shopify/shopify-app-remix/build/ts/server/clients";

export const createDiscount = async ({ admin }: { admin: any }) => {
  return await admin.graphql(
    `#graphql
  mutation discountAutomaticBasicCreate($automaticBasicDiscount: DiscountAutomaticBasicInput!) {
    discountAutomaticBasicCreate(automaticBasicDiscount: $automaticBasicDiscount) {
      automaticDiscountNode {
        id
        automaticDiscount {
          ... on DiscountAutomaticBasic {
            startsAt
            endsAt
            customerGets {
              value {
                ... on DiscountPercentage {
                    percentage: percentage
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        code
        message
      }
    }
  }`,
    {
      variables: {
        automaticBasicDiscount: {
          title: "50% off",
          startsAt: "2023-06-21T00:00:00Z",
          endsAt: null,
          customerGets: {
            items: {
              all: true,
            },
            value: {
              percentage: 0.5,
            },
          },
          minimumRequirement: {
            quantity: {
              greaterthanorequaltoquantity: "1",
            },
          },
        },
      },
    },
  );
};

export const getDiscountsUpdatedAfter = async ({
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
      query automaticDiscountNodes($nextCursor: String) {
        automaticDiscountNodes(first: 2, reverse: true, after: $nextCursor, query: "updated_at:>=01-01-2022") {
          edges {
            node {
              id
              automaticDiscount {
                ... on DiscountAutomaticBasic {
                  title
                  summary
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

export const getDiscountsUpdatedAfterWithItems = async ({
  admin,
  nextCursorParam,
  query,
}: {
  admin: AdminApiContext<RestResources>;
  nextCursorParam: string | null;
  query: string;
}) => {
  return await admin.graphql(
    `#graphql
      query automaticDiscountNodes($nextCursor: String, $query: String) {
        automaticDiscountNodes(first: 2, reverse: true, after: $nextCursor, query: $query) {
          edges {
            node {
              id
              automaticDiscount {
                ... on DiscountAutomaticBasic {
                  title
                  summary
                  customerGets {
                    items {
                      ... on DiscountProducts {
                        products(first: 2) {
                          edges {
                            node {
                              id
                              handle
                              title
                            }
                          }
                        }
                      }
                    }
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
  return await admin.graphql(
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
};
