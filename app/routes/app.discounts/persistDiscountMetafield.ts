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

  const metafieldValueEntity = await prisma.metafieldValue.findUnique({
    where: {
      value: metafieldValue.toString(),
    },
  });

  if (!metafieldValueEntity || !metafieldValueEntity.value) {
    return json({
      error: "Missing data - metafieldValue is not in the db",
      metafieldDefinitionId: metafieldDefinition,
      metafieldValue,
      discount,
    });
  }

  console.log(metafieldValueEntity?.value);
  console.log(metafieldDefinition, metafieldValue, discount);

  const persisted = await prisma.discountMetafieldUnion.create({
    data: {
      active: false,
      discount_id: discount.toString(),
      metafieldDefinitionId: metafieldDefinition.toString(),
      metafield_value_id: metafieldValueEntity.value,
    },
  });

  return json({ union: persisted });
};
