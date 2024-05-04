import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import { shopRedact } from "./shopRedact";
import { getStoreId } from "graphql/storeQueries";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, session, admin, payload } =
    await authenticate.webhook(request);

  if (!admin) {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    throw new Response();
  }

  switch (topic) {
    case "APP_UNINSTALLED":
      if (session) {
        await db.session.deleteMany({ where: { shop } });
      }

      break;
    case "CUSTOMERS_DATA_REQUEST":
    case "CUSTOMERS_REDACT":
    case "SHOP_REDACT":
      const hmacHeader = request.headers.get("X-Shopify-Hmac-SHA256") || "";
      const dataText = await request.text();
      const storeRequest = await getStoreId({
        admin: admin,
      });
      const storeJson = await storeRequest.json();
      const storeId = storeJson.data.shop.id;
      const shopRedactResult = shopRedact(dataText, hmacHeader, storeId);
      throw shopRedactResult;
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
