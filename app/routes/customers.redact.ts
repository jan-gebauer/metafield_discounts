import { ActionFunctionArgs, json } from "@remix-run/node";
import { verifyWebhook } from "~/shopify-webhook-utility";

export const action = async ({ request }: ActionFunctionArgs) => {
  const dataBuffer = await request.text();
  const hmacHeader = request.headers.get("X-Shopify-Hmac-SHA256");

  if (!hmacHeader || !verifyWebhook(dataBuffer, hmacHeader)) {
    return json({ success: false }, 401);
  }
  return json({ success: true }, 200);
};
