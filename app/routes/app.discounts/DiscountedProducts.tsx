import { NavigateFunction, useFetcher, useNavigate } from "@remix-run/react";
import {
  Card,
  BlockStack,
  IndexTable,
  Button,
  Checkbox,
} from "@shopify/polaris";
import { XIcon } from "@shopify/polaris-icons";
import { DiscountMetafields } from "../app.discounts";
import { useState } from "react";

const buildRows = (
  data: DiscountMetafields[],
  navigate: NavigateFunction,
  url: string,
  toggleHandler: () => void,
  deleteHandler: () => void,
) => {
  const rows = data.map((discountMetafield, index) => {
    return (
      <IndexTable.Row
        id={discountMetafield.discount}
        key={discountMetafield.discount}
        position={index}
        onClick={() =>
          navigate(`${url}/${discountMetafield.discountMetafieldUnionId}`)
        }
      >
        <IndexTable.Cell>{discountMetafield.discount}</IndexTable.Cell>
        <IndexTable.Cell>
          {discountMetafield.metafieldNamespaceKey}
        </IndexTable.Cell>
        <IndexTable.Cell>{discountMetafield.value}</IndexTable.Cell>
        <IndexTable.Cell>
          <Checkbox
            label=""
            checked={discountMetafield.active}
            onChange={() => {
              discountMetafield.active = !discountMetafield.active;
              console.log(discountMetafield.active);
              toggleHandler();
            }}
          />
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Button icon={XIcon} onClick={deleteHandler} />
        </IndexTable.Cell>
      </IndexTable.Row>
    );
  });

  return rows;
};

export default function DiscountedProducts(props: {
  url: string;
  data: DiscountMetafields[];
  toggleHandler: () => void;
  deleteHandler: () => void;
}) {
  const navigate = useNavigate();
  const [testState, setTestState] = useState(false);

  return (
    <Card>
      <ui-title-bar title="Additional page" />
      <BlockStack gap="300">
        <IndexTable
          headings={[
            { title: "Discount" },
            { title: "Metafield" },
            { title: "Metafield value" },
            { title: "Toggle" },
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
          {buildRows(
            props.data,
            navigate,
            props.url,
            props.toggleHandler,
            props.deleteHandler,
          )}
          <IndexTable.Row id={"asd"} key={"asd"} position={69}>
            <IndexTable.Cell>{"test"}</IndexTable.Cell>
            <IndexTable.Cell>{"test"}</IndexTable.Cell>
            <IndexTable.Cell>{"test"}</IndexTable.Cell>
            <IndexTable.Cell>
              <Checkbox
                label=""
                checked={testState}
                onChange={() => {
                  setTestState(!testState);
                  console.log(testState);
                  // toggleHandler();
                }}
              />
            </IndexTable.Cell>
            <IndexTable.Cell>
              <Button icon={XIcon} onClick={() => console.log("hi")} />
            </IndexTable.Cell>
          </IndexTable.Row>
        </IndexTable>
      </BlockStack>
    </Card>
  );
}
