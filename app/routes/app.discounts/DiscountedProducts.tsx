import { useLoaderData, useNavigate } from "@remix-run/react";
import { Card, BlockStack, IndexTable, Icon, Button } from "@shopify/polaris";
import {
  XIcon
} from '@shopify/polaris-icons';

// this is where you would have the loading or component or something that carries the metafield-discounts
// you would then display it in the app.discounts page
// 
// I think you steal what is in app.products.foo
// 

const buildRows = (data: any) => {

  // const rows = data.data.products.edges.map((edge: any, index: number) => {
  //   return (
  //     <IndexTable.Row id={edge.node.id} key={edge.node.id} position={index}>
  //       <IndexTable.Cell>
  //         {edge.node.title}
  //       </IndexTable.Cell>
  //     </IndexTable.Row >
  //   )
  // })

  const rows = (
    <IndexTable.Row id={"0"} key={0} position={0}>
      <IndexTable.Cell>
        test
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Button icon={XIcon} onClick={() => console.log("click")} />
      </IndexTable.Cell>
    </IndexTable.Row >)

  return rows

}

export default function DiscountedProducts(props: { url: string, data: any }) {
  const navigate = useNavigate()
  // const pageInfo = props.data.data.products.pageInfo || null;

  return (
    <Card>
      <ui-title-bar title="Additional page" />
      <BlockStack gap="300">
        <IndexTable
          headings={[{ title: "Title" }]}
          itemCount={10}
          pagination={{
            // hasNext: pageInfo.hasNextPage,
            // hasPrevious: pageInfo.hasPreviousPage,
            hasNext: false,
            hasPrevious: false,
            onNext: () => {
              // navigate(`${props.url}?nextCursor=${pageInfo.endCursor}`)
              navigate(`${props.url}?nextCursor=foo`)
            },
            onPrevious: () => {
              // navigate(`${props.url}foo?previousCursor=${pageInfo.startCursor}`)
              navigate(`${props.url}foo?previousCursor=bar`)
            }
          }}
        >
          {buildRows(props.data)}
        </IndexTable>
      </BlockStack>
    </Card>
  );
}