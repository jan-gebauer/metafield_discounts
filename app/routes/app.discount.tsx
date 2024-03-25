import { Item, Metafield } from "@prisma/client";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import {
  Card,
  Text,
  BlockStack,
  IndexTable,
} from "@shopify/polaris";
import { createDiscount } from "graphql/discountQueries";
import { getProduct, getProductLastPage } from "graphql/productQueries";
import { authenticate } from "~/shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD")

  const response = await createDiscount({ admin });
  console.log(response)
  if (!response) {
    return null
  }
  return response.json();

};

export default function DiscountPage() {
  const data: any = useLoaderData();
  console.log(data)

  return (
    null
  );
}
