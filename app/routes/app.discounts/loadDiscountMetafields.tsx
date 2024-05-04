import { RestResources } from "@shopify/shopify-api/rest/admin/2024-01";
import { getDiscountWithId } from "graphql/discountQueries";
import { getMetafieldDefinition } from "graphql/metafieldQueries";
import { AdminApiContext } from "node_modules/@shopify/shopify-app-remix/dist/ts/server/clients";
import prisma from "~/db.server";
import { DiscountMetafields } from "../app._index";

export const loadDmusHumanReadable = async (
  admin: AdminApiContext<RestResources>,
  storeId: string,
): Promise<DiscountMetafields[]> => {
  const dmus = await prisma.dmu.findMany({
    where: {
      store_id: storeId,
    },
  });

  let humanReadableDmus = [];
  for (const dmu of dmus) {
    try {
      const discount = await getDiscountWithId({
        admin: admin,
        id: dmu.discount_id,
      });

      const metafieldDefinition = await getMetafieldDefinition({
        admin: admin,
        id: dmu.metafield_definition_id,
      });

      humanReadableDmus.push({
        dmuId: dmu.id,
        discount: discount.automaticDiscount.title,
        metafieldNamespaceKey: `${metafieldDefinition.namespace}.${metafieldDefinition.key}`,
        value: dmu.metafield_value,
        active: dmu.active,
      });
    } catch (e) {
      console.log(e);
    }
  }

  return humanReadableDmus;
};
