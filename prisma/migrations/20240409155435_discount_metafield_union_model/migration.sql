/*
  Warnings:

  - You are about to drop the column `value` on the `Metafield` table. All the data in the column will be lost.
  - The primary key for the `DiscountMetafieldUnion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `metafield_id` on the `DiscountMetafieldUnion` table. All the data in the column will be lost.
  - Added the required column `metafield_value_id` to the `Metafield` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metafield_definition_id` to the `DiscountMetafieldUnion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metafield_value_id` to the `DiscountMetafieldUnion` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "MetafieldValue" (
    "value" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "MetafieldDefinitionValue" (
    "metafield_definition_id" TEXT NOT NULL,
    "metafield_id" TEXT NOT NULL,

    PRIMARY KEY ("metafield_definition_id", "metafield_id"),
    CONSTRAINT "MetafieldDefinitionValue_metafield_definition_id_fkey" FOREIGN KEY ("metafield_definition_id") REFERENCES "MetafieldDefinition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MetafieldDefinitionValue_metafield_id_fkey" FOREIGN KEY ("metafield_id") REFERENCES "Metafield" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Metafield" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "item_id" TEXT NOT NULL,
    "metafield_definition_id" TEXT NOT NULL,
    "metafield_value_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "discount_id" TEXT,
    "active" BOOLEAN,
    CONSTRAINT "Metafield_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Metafield_metafield_definition_id_fkey" FOREIGN KEY ("metafield_definition_id") REFERENCES "MetafieldDefinition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Metafield_metafield_value_id_fkey" FOREIGN KEY ("metafield_value_id") REFERENCES "MetafieldValue" ("value") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Metafield_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "Discount" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Metafield" ("active", "description", "discount_id", "id", "item_id", "metafield_definition_id", "type") SELECT "active", "description", "discount_id", "id", "item_id", "metafield_definition_id", "type" FROM "Metafield";
DROP TABLE "Metafield";
ALTER TABLE "new_Metafield" RENAME TO "Metafield";
CREATE TABLE "new_DiscountMetafieldUnion" (
    "discount_id" TEXT NOT NULL,
    "metafield_definition_id" TEXT NOT NULL,
    "metafield_value_id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "metafieldId" TEXT,

    PRIMARY KEY ("discount_id", "metafield_definition_id", "metafield_value_id"),
    CONSTRAINT "DiscountMetafieldUnion_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "Discount" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DiscountMetafieldUnion_metafield_definition_id_fkey" FOREIGN KEY ("metafield_definition_id") REFERENCES "MetafieldDefinition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DiscountMetafieldUnion_metafield_value_id_fkey" FOREIGN KEY ("metafield_value_id") REFERENCES "MetafieldValue" ("value") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DiscountMetafieldUnion_metafieldId_fkey" FOREIGN KEY ("metafieldId") REFERENCES "Metafield" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_DiscountMetafieldUnion" ("active", "discount_id") SELECT "active", "discount_id" FROM "DiscountMetafieldUnion";
DROP TABLE "DiscountMetafieldUnion";
ALTER TABLE "new_DiscountMetafieldUnion" RENAME TO "DiscountMetafieldUnion";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
