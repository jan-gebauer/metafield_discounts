import { ActionFunctionArgs, TypedResponse, json } from "@remix-run/node";

export const persistDiscountMetafield = async ({
  formData,
}: {
  formData: FormData;
}): Promise<TypedResponse<{}>> => {
  const metafieldDefinitionId = formData.get("metafieldDefinition");
  const metafieldValue = formData.get("metafieldValue");
  const discount = formData.get("discount");

  if (!metafieldDefinitionId || !metafieldValue || !discount) {
    return json({
      error: "Missing data",
      metafieldDefinitionId,
      metafieldValue,
      discount,
    });
  }

  const result = await prisma.metafield.updateMany({
    where: {
      metafieldDefinitionId: metafieldDefinitionId.valueOf(),
      value: metafieldValue.valueOf(),
    },
    data: {
      discount_id: discount.valueOf(),
    },
  });

  return json({ numChangedEntries: result.count });
};
