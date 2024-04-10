/*
  Warnings:

  - The primary key for the `DiscountMetafieldUnion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `DiscountMetafieldUnion` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DiscountMetafieldUnion" (
    "discount_id" TEXT NOT NULL,
    "metafield_id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,

    PRIMARY KEY ("discount_id", "metafield_id"),
    CONSTRAINT "DiscountMetafieldUnion_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "Discount" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DiscountMetafieldUnion_metafield_id_fkey" FOREIGN KEY ("metafield_id") REFERENCES "Metafield" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DiscountMetafieldUnion" ("active", "discount_id", "metafield_id") SELECT "active", "discount_id", "metafield_id" FROM "DiscountMetafieldUnion";
DROP TABLE "DiscountMetafieldUnion";
ALTER TABLE "new_DiscountMetafieldUnion" RENAME TO "DiscountMetafieldUnion";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
