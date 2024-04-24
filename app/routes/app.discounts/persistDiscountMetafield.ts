import { ActionFunctionArgs, TypedResponse, json } from "@remix-run/node";

export const persistDmu = async ({
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

  const persisted = await prisma.dmu.create({
    data: {
      discount_id: discount.toString(),
      metafield_definition_id: metafieldDefinition.toString(),
      metafield_value: metafieldValue.toString(),
      active: false,
    },
  });

  return json({ union: persisted });
};
