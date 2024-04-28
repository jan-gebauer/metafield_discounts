import { ActionFunctionArgs, json } from "@remix-run/node";
import { getStoreId } from "graphql/storeQueries";
import { authenticate } from "~/shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  const storeRequest = await getStoreId({
    admin: admin,
  });
  const storeJson = await storeRequest.json();
  const storeId = storeJson.data.shop.id;

  prisma.dmu.deleteMany({
    where: {
      store_id: storeId,
    },
  });

  return json({ success: true }, 200);
};
