import { RestResources } from "@shopify/shopify-api/rest/admin/2024-01";
import { AdminApiContext } from "node_modules/@shopify/shopify-app-remix/build/ts/server/clients";
import { DmuPackage } from "~/routes/app.dmu.$dmuId";
import { DiscountAutomaticBasicInput } from "~/types/admin.types";
import { getDiscountsUpdatedAfterWithItems } from "./discountQueries";

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
