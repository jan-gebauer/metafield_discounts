import { RestResources } from "@shopify/shopify-api/rest/admin/2024-01";
import { AdminApiContext } from "node_modules/@shopify/shopify-app-remix/dist/ts/server/clients";
import { DiscountAutomaticBasicInput } from "~/types/admin.types";

export async function requestDmuToggle(
  admin: AdminApiContext<RestResources>,
  discountId: string,
  productIdsToRemove: string[],
  productIdsToAdd: string[],
) {
  const automaticBasicDiscount: DiscountAutomaticBasicInput = {
    customerGets: {
      items: {
        products: {
          productsToAdd: productIdsToAdd,
          productsToRemove: productIdsToRemove,
        },
      },
    },
  };

  return await admin.graphql(
    `#graphql
      mutation discountAutomaticBasicUpdate($discountId: ID!, $automaticBasicDiscount: DiscountAutomaticBasicInput!) {
    discountAutomaticBasicUpdate(id: $discountId
    automaticBasicDiscount: $automaticBasicDiscount){
      automaticDiscountNode {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
    `,
    {
      variables: {
        discountId: discountId,
        automaticBasicDiscount: automaticBasicDiscount,
      },
    },
  );
}
