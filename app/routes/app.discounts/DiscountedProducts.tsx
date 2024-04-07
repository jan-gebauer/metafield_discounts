import { useLoaderData, useNavigate } from "@remix-run/react";
import { Card, BlockStack, IndexTable, Icon, Button } from "@shopify/polaris";
import { XIcon } from "@shopify/polaris-icons";
import { DiscountMetafields } from "../app.discounts";

const buildRows = (data: DiscountMetafields[]) => {
  const rows = data.map((discountMetafield, index) => {
    return (
      <IndexTable.Row
        id={discountMetafield.discount}
        key={discountMetafield.discount}
        position={index}
      >
        <IndexTable.Cell>{discountMetafield.discount}</IndexTable.Cell>
        <IndexTable.Cell>
          {discountMetafield.metafieldNamespaceKey}
        </IndexTable.Cell>
        <IndexTable.Cell>{discountMetafield.value}</IndexTable.Cell>
        <IndexTable.Cell>
          <Button icon={XIcon} onClick={() => console.log("click")} />
        </IndexTable.Cell>
      </IndexTable.Row>
    );
  });

  return rows;
};

export default function DiscountedProducts(props: {
  url: string;
  data: {
    discount: string;
    metafieldNamespaceKey: string;
    value: string;
  }[];
}) {
  const navigate = useNavigate();
  // const pageInfo = props.data.data.products.pageInfo || null;

  return (
    <Card>
      <ui-title-bar title="Additional page" />
      <BlockStack gap="300">
        <IndexTable
          headings={[
            { title: "Discount" },
            { title: "Metafield" },
            { title: "Metafield value" },
            { title: "Delete" },
          ]}
          itemCount={10}
          pagination={{
            // hasNext: pageInfo.hasNextPage,
            // hasPrevious: pageInfo.hasPreviousPage,
            hasNext: false,
            hasPrevious: false,
            onNext: () => {
              // navigate(`${props.url}?nextCursor=${pageInfo.endCursor}`)
              navigate(`${props.url}?nextCursor=foo`);
            },
            onPrevious: () => {
              // navigate(`${props.url}foo?previousCursor=${pageInfo.startCursor}`)
              navigate(`${props.url}foo?previousCursor=bar`);
            },
          }}
        >
          {buildRows(props.data)}
        </IndexTable>
      </BlockStack>
    </Card>
  );
}
