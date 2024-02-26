export const createDiscount = async ({
    admin,
}: {
    admin: any;
}) => {
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
                "automaticBasicDiscount": {
                    "title": "50% off",
                    "startsAt": "2023-06-21T00:00:00Z",
                    "endsAt": null,
                    "customerGets": {
                        "value": {
                            "percentage": 50.0,
                        }
                    }
                }
            },
        },
    )
};