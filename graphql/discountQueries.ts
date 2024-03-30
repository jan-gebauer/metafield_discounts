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
