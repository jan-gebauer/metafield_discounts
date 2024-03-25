import { Item, Metafield } from "@prisma/client";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import {
  Card,
  Text,
  BlockStack,
  IndexTable,
} from "@shopify/polaris";
import { getProduct, getProductLastPage } from "graphql/productQueries";
import { authenticate } from "~/shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  console.log("PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP")
  const url = new URL(request.url);
  const nextCursorParam = url.searchParams.get("nextCursor") || null;
  const previousCursorParam = url.searchParams.get("previousCursor") || null;
  let firstNumber = previousCursorParam == null ? 10 : null
  let lastNumber = nextCursorParam == null ? 10 : null


  console.log("test")
  console.log(firstNumber, lastNumber)

  let response = null
  if (firstNumber != null && lastNumber != null || lastNumber != null) {
    response = await getProduct({ admin, nextCursorParam });
  } else if (firstNumber != null) {
    response = await getProductLastPage({ admin, previousCursorParam });
  }
  console.log(response)
  if (!response) {
    return null
  }
  const responseJson = await response.json();
  console.log(responseJson.data.products.edges)
  const edges = responseJson.data.products.edges
  const itemsWithMetafields: { item: Item, metafields: Metafield[] }[] = edges.map((edge: any) => {
    console.log(edge.node)
    const item: Item = {
      id: edge.node.id,
      title: edge.node.title,
      handle: edge.node.handle,
    }
    const metafieldNodes = edge.node.metafields.edges
    console.log(metafieldNodes)
    const metafields = metafieldNodes.map((metafield: any) => {
      return metafield.node
    })
    console.log(metafields)
    return {
      item: item,
      metafields: metafields
    }
  })
  itemsWithMetafields.forEach(async (itemWithMetafields: { item: Item, metafields: Metafield[] }) => {
    const res = await prisma.item.create({
      data: {
        id: itemWithMetafields.item.id,
        title: itemWithMetafields.item.title,
        handle: itemWithMetafields.item.handle,
        Metafield: {
          create: itemWithMetafields.metafields
        }
      },
      include: {
        Metafield: true,
      }
    })
    console.log(res)
  })
  return responseJson;

};

const buildRows = (data: any) => {

  const rows = data.data.products.edges.map((edge: any, index: number) => {
    return (
      <IndexTable.Row id={edge.node.id} key={edge.node.id} position={index}>
        <IndexTable.Cell>
          {edge.node.title}
        </IndexTable.Cell>
      </IndexTable.Row >
    )
  })

  return rows

}


export default function PersistPage() {
  const navigate = useNavigate()
  const data: any = useLoaderData();

  console.log(data)
  console.log(data.data.products.pageInfo)
  const pageInfo = data.data.products.pageInfo || null;
  console.log(pageInfo)
  return (
    <Card>
      <ui-title-bar title="Additional page" />
      <BlockStack gap="300">
        <Text as="p" variant="bodyMd">
          This is a test.
          foo
        </Text>
        <IndexTable
          headings={[{ title: "Title" }]}
          itemCount={10}
          pagination={{
            hasNext: pageInfo.hasNextPage,
            hasPrevious: pageInfo.hasPreviousPage,
            onNext: () => {
              navigate(`/app/products/foo?nextCursor=${pageInfo.endCursor}`)
            },
            onPrevious: () => {
              navigate(`/app/products/foo?previousCursor=${pageInfo.startCursor}`)
            }
          }}
        >
          {buildRows(data)}
        </IndexTable>
      </BlockStack>
    </Card>
  );
}
