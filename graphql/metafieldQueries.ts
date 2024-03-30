export const getMetafieldsUpdatedAfter = async ({
  admin,
  nextCursorParam,
  query,
}: {
  admin: any;
  nextCursorParam: string | null;
  query: string;
}) => {
  return await admin.graphql(
    `#graphql
      query metafieldDefinitions($nextCursor: String) {
        metafieldDefinitions(first: 2, reverse: true, after: $nextCursor, query: "updated_at:>=01-01-2022", ownerType: PRODUCT) {
          edges {
            node {
              id
              name
              namespace
              key
            }
          },
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          
        }
      }`,
    {
      variables: {
        nextCursor: nextCursorParam,
        query: query,
      },
    },
  );
};
