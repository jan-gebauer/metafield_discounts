import { verifyWebhook } from "~/shopify-webhook-utility";

export const shopRedact = async (
  dataText: string,
  hmacHeader: string,
  storeId: string,
) => {
  if (!hmacHeader || !verifyWebhook(dataText, hmacHeader)) {
    return new Response("HMAC headers don't match", { status: 401 });
  }

  prisma.dmu.deleteMany({
    where: {
      store_id: storeId,
    },
  });

  return new Response("Success", { status: 200 });
};
