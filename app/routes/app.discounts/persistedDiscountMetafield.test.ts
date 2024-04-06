import prisma from "../../db.server";
import { persistDiscountMetafield } from "./persistDiscountMetafield";

test("persist a discount-metafield binding", async () => {
  const discountId = "gid://shopify/DiscountAutomaticNode/1985361608894";
  const metafield = {
    metafieldDefinition: "gid://shopify/MetafieldDefinition/19591561406",
    value: "qwe",
  };
  const formData = new FormData();
  formData.append("discount", discountId);
  formData.append("metafieldDefinition", metafield.metafieldDefinition);
  formData.append("metafieldValue", metafield.value);
  const res: Promise<FormData> = new Promise((resolve) => {
    resolve(formData);
  });
  await persistDiscountMetafield({
    formData,
  });
  const result = await prisma.metafield.findMany({
    where: {
      discount_id: discountId,
    },
  });
  expect(result.length).toBeGreaterThan(0);

  await prisma.metafield.updateMany({
    where: {
      metafieldDefinitionId: metafield.metafieldDefinition,
      value: metafield.value,
    },
    data: {
      discount_id: null,
    },
  });
});
