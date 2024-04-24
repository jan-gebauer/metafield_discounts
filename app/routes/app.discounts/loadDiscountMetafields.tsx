import { DiscountMetafields } from "../app.discounts";

export const loadDmus = async (): Promise<DiscountMetafields[]> => {
  const dmus = await prisma.dmu.findMany();

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
