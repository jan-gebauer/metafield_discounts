# Metafield Discounts

Metafield Discounts is a Shopify App built using the standard Shopify TS Remix stack.

## What does it do?

Shopify does not natively support the interaction between metafields and other fields of a product. This means that it is not easy to setup a discount that applies only to products, that have a specific metafield. I aim to solve this problem.

When creating a new Discount - Metafield coupling, the Shopify backend gets queried for all Metafield Definitions and Discounts. The exact Metafield Value needs to be filled out by the user. This coupling is then persisted using Prisma ORM so that the user can later enable or disable the coupling.

## Bounded Context/Architecture

The key concepts in this app are Discount, Metafield Definition, Metafield Value and Product. Plus, I had to invent the union of these, which I call Discount Metafield Union in the code and Discount Metafield Coupling in the UI. This is probably not so wise but Union seems like a too technical of a term.
