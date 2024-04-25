import { DiscountMetafields } from "../app.discounts";

export const loadDmus = async (
  storeId: string,
): Promise<DiscountMetafields[]> => {
  const dmus = await prisma.dmu.findMany({
    where: {
      store_id: storeId,
    },
  });

  return dmus.map((dmu) => {
    return {
      dmuId: dmu.id,
      discount: dmu.discount_id,
      metafieldNamespaceKey: `${dmu.metafield_definition_id}.${dmu.metafield_definition_id}`,
      value: dmu.metafield_value,
      active: dmu.active,
    };
  });
};
