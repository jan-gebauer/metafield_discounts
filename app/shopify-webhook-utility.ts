import { createHmac, timingSafeEqual } from "crypto";

const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET || "";

export function verifyWebhook(data: string, hmacHeader: string): boolean {
  const digest = createHmac("sha256", CLIENT_SECRET)
    .update(data)
    .digest("base64");
  const computedHmac = Buffer.from(digest, "base64");

  return timingSafeEqual(computedHmac, Buffer.from(hmacHeader, "utf-8"));
}
