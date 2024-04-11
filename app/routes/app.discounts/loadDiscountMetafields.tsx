import { Discount } from "@prisma/client";
import { DiscountMetafields } from "../app.discounts";

export const loadDiscountMetafields = async (): Promise<
  DiscountMetafields[]
> => {
  const metafields = await prisma.metafield.findMany();
  const discountMetafieldUnions =
    await prisma.discountMetafieldUnion.findMany();

  const displayableDiscountMetafieldUnions = await Promise.all(
    discountMetafieldUnions.map(async (union) => {
      if (union.discount_id) {
        const discount: Discount | null = await prisma.discount.findUnique({
          where: {
            id: union.discount_id,
          },
        });
        const metafieldDefinition = await prisma.metafieldDefinition.findUnique(
          {
            where: {
              id: union.metafieldDefinitionId,
            },
          },
        );
        return {
          discount: discount?.title ?? null,
          metafieldNamespaceKey: `${metafieldDefinition?.namespace ?? null}.${metafieldDefinition?.key ?? null}`,
          value: union.metafield_value_id,
        };
      }
    }),
  );

  const nonEmptyDisplayables = displayableDiscountMetafieldUnions.filter(
    (displayable) => {
      if (
        !displayable ||
        !displayable.discount ||
        !displayable.metafieldNamespaceKey
      ) {
        return false;
      }
      return true;
    },
  );
  const stringedDisplayables = nonEmptyDisplayables.map((displayable) => {
    return JSON.stringify(displayable);
  });
  const stringedDiscountMetafieldSet = new Set([...stringedDisplayables]);
  return Array.from(stringedDiscountMetafieldSet).map((displayable) =>
    JSON.parse(displayable),
  );
};
