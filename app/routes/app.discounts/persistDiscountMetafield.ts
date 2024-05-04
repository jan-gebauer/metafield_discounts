import { ActionFunctionArgs, TypedResponse, json } from "@remix-run/node";
import prisma from "~/db.server";

export const persistDmu = async ({
  formData,
}: {
  formData: FormData;
}): Promise<TypedResponse<{}>> => {
  const metafieldDefinition = formData.get("metafieldDefinition");
  const metafieldValue = formData.get("metafieldValue");
  const discount = formData.get("discount");
  const storeId = formData.get("storeId");

  if (!metafieldDefinition || !metafieldValue || !discount || !storeId) {
    return json({
      error: "Missing data",
      storeId: storeId,
      metafieldDefinitionId: metafieldDefinition,
      metafieldValue,
      discount,
    });
  }

  const persisted = await prisma.dmu.create({
    data: {
      store_id: storeId.toString(),
      discount_id: discount.toString(),
      metafield_definition_id: metafieldDefinition.toString(),
      metafield_value: metafieldValue.toString(),
      active: false,
    },
  });

  return json({ id: persisted.id });
};
