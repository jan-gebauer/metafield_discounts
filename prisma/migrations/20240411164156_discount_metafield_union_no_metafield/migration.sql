/*
  Warnings:

  - You are about to drop the column `metafieldId` on the `DiscountMetafieldUnion` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DiscountMetafieldUnion" (
    "discount_id" TEXT NOT NULL,
    "metafield_definition_id" TEXT NOT NULL,
    "metafield_value_id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,

    PRIMARY KEY ("discount_id", "metafield_definition_id", "metafield_value_id"),
    CONSTRAINT "DiscountMetafieldUnion_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "Discount" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DiscountMetafieldUnion_metafield_definition_id_fkey" FOREIGN KEY ("metafield_definition_id") REFERENCES "MetafieldDefinition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DiscountMetafieldUnion_metafield_value_id_fkey" FOREIGN KEY ("metafield_value_id") REFERENCES "MetafieldValue" ("value") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DiscountMetafieldUnion" ("active", "discount_id", "metafield_definition_id", "metafield_value_id") SELECT "active", "discount_id", "metafield_definition_id", "metafield_value_id" FROM "DiscountMetafieldUnion";
DROP TABLE "DiscountMetafieldUnion";
ALTER TABLE "new_DiscountMetafieldUnion" RENAME TO "DiscountMetafieldUnion";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
