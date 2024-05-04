import { NavigateFunction, useNavigate } from "@remix-run/react";
import { Card, BlockStack, IndexTable, Button } from "@shopify/polaris";
import { DiscountMetafields } from "../app._index";

const buildRows = (
  data: DiscountMetafields[],
  navigate: NavigateFunction,
  url: string,
) => {
  console.log(data);
  const rows = data.map((discountMetafield, index) => {
    console.log(discountMetafield);
    return (
      <IndexTable.Row
        id={discountMetafield.discount}
        key={discountMetafield.discount}
        position={index}
        onClick={() => navigate(`${url}/${discountMetafield.dmuId}`)}
      >
        <IndexTable.Cell>{discountMetafield.discount}</IndexTable.Cell>
        <IndexTable.Cell>
          {discountMetafield.metafieldNamespaceKey}
        </IndexTable.Cell>
        <IndexTable.Cell>{discountMetafield.value}</IndexTable.Cell>
        <IndexTable.Cell>
          <Button onClick={() => navigate(`${url}/${discountMetafield.dmuId}`)}>
            Open
          </Button>
        </IndexTable.Cell>
      </IndexTable.Row>
    );
  });

  return rows;
};

export default function DmusOverviewTable(props: {
  url: string;
  data: DiscountMetafields[];
}) {
  const navigate = useNavigate();

  return (
    <Card>
      <BlockStack gap="300">
        <IndexTable
          headings={[
            { title: "Discount" },
            { title: "Metafield" },
            { title: "Metafield value" },
            { title: "" },
          ]}
          selectable={false}
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
          {buildRows(props.data, navigate, props.url)}
        </IndexTable>
      </BlockStack>
    </Card>
  );
}
