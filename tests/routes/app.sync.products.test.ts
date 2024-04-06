import prisma from "../../app/db.server";

test.skip("database access", async () => {
  let metafield: any = { node: "test" };
  const metafieldDefinition = await prisma.metafieldDefinition.findFirst({
    where: {
      namespace: metafield.node.namespace,
      key: metafield.node.key,
    },
  });
  console.log(metafieldDefinition);
  expect(metafieldDefinition).not.toBeNull();
});
