import { ActionFunctionArgs, json } from "@remix-run/node";
import { getStoreId } from "graphql/storeQueries";
import { verifyWebhook } from "~/shopify-webhook-utility";
import { authenticate } from "~/shopify.server";

export const shopRedact = async (
  dataText: string,
  hmacHeader: string,
  storeId: string,
) => {
  console.log("hello");

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
