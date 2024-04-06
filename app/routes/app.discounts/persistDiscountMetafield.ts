import { ActionFunctionArgs, TypedResponse, json } from "@remix-run/node";

export const persistDiscountMetafield = async ({
  formData,
}: {
  formData: FormData;
}): Promise<TypedResponse<{}>> => {
  const metafieldDefinition = formData.get("metafieldDefinition");
  const metafieldValue = formData.get("metafieldValue");
  const discount = formData.get("discount");

  if (!metafieldDefinition || !metafieldValue || !discount) {
    return json({
      error: "Missing data",
      metafieldDefinitionId: metafieldDefinition,
      metafieldValue,
      discount,
    });
  }

  const result = await prisma.metafield.updateMany({
    where: {
      metafieldDefinitionId: metafieldDefinition.valueOf(),
      value: metafieldValue.valueOf(),
    },
    data: {
      discount_id: discount.valueOf(),
    },
  });

  return json({ numChangedEntries: result.count });
};
