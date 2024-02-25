
export const getCollection = async ({
    admin,
    nextCursorParam,
}: {
    admin: any;
    nextCursorParam: string | null;
}) => {
    return await admin.graphql(
        `#graphql
      query products($nextCursor: String) {
        products(first: 10, reverse: true, after: $nextCursor) {
          edges {
            node {
              id
              title
              handle
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
            },
        },
    );
};