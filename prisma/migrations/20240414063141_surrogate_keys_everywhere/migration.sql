/*
  Warnings:

  - The primary key for the `DiscountMetafieldUnion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MetafieldValue` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MetafieldDefinitionValue` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `DiscountMetafieldUnion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `MetafieldValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `MetafieldDefinitionValue` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DiscountMetafieldUnion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "discount_id" TEXT NOT NULL,
    "metafield_definition_id" TEXT NOT NULL,
    "metafield_value_id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    CONSTRAINT "DiscountMetafieldUnion_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "Discount" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DiscountMetafieldUnion_metafield_definition_id_fkey" FOREIGN KEY ("metafield_definition_id") REFERENCES "MetafieldDefinition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DiscountMetafieldUnion_metafield_value_id_fkey" FOREIGN KEY ("metafield_value_id") REFERENCES "MetafieldValue" ("value") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DiscountMetafieldUnion" ("active", "discount_id", "metafield_definition_id", "metafield_value_id") SELECT "active", "discount_id", "metafield_definition_id", "metafield_value_id" FROM "DiscountMetafieldUnion";
DROP TABLE "DiscountMetafieldUnion";
ALTER TABLE "new_DiscountMetafieldUnion" RENAME TO "DiscountMetafieldUnion";
CREATE UNIQUE INDEX "DiscountMetafieldUnion_discount_id_metafield_definition_id_metafield_value_id_key" ON "DiscountMetafieldUnion"("discount_id", "metafield_definition_id", "metafield_value_id");
CREATE TABLE "new_MetafieldValue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL
);
INSERT INTO "new_MetafieldValue" ("value") SELECT "value" FROM "MetafieldValue";
DROP TABLE "MetafieldValue";
ALTER TABLE "new_MetafieldValue" RENAME TO "MetafieldValue";
CREATE UNIQUE INDEX "MetafieldValue_value_key" ON "MetafieldValue"("value");
CREATE TABLE "new_MetafieldDefinitionValue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "metafield_definition_id" TEXT NOT NULL,
    "metafield_id" TEXT NOT NULL,
    CONSTRAINT "MetafieldDefinitionValue_metafield_definition_id_fkey" FOREIGN KEY ("metafield_definition_id") REFERENCES "MetafieldDefinition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MetafieldDefinitionValue_metafield_id_fkey" FOREIGN KEY ("metafield_id") REFERENCES "Metafield" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MetafieldDefinitionValue" ("metafield_definition_id", "metafield_id") SELECT "metafield_definition_id", "metafield_id" FROM "MetafieldDefinitionValue";
DROP TABLE "MetafieldDefinitionValue";
ALTER TABLE "new_MetafieldDefinitionValue" RENAME TO "MetafieldDefinitionValue";
CREATE UNIQUE INDEX "MetafieldDefinitionValue_metafield_definition_id_metafield_id_key" ON "MetafieldDefinitionValue"("metafield_definition_id", "metafield_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
