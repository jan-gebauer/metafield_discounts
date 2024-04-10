/*
  Warnings:

  - You are about to drop the column `active` on the `Metafield` table. All the data in the column will be lost.
  - Made the column `description` on table `Metafield` required. This step will fail if there are existing NULL values in that column.
  - Made the column `discount_id` on table `Metafield` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Metafield" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "item_id" TEXT NOT NULL,
    "metafield_definition_id" TEXT NOT NULL,
    "metafield_value_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "discount_id" TEXT NOT NULL,
    CONSTRAINT "Metafield_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Metafield_metafield_definition_id_fkey" FOREIGN KEY ("metafield_definition_id") REFERENCES "MetafieldDefinition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Metafield_metafield_value_id_fkey" FOREIGN KEY ("metafield_value_id") REFERENCES "MetafieldValue" ("value") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Metafield_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "Discount" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Metafield" ("description", "discount_id", "id", "item_id", "metafield_definition_id", "metafield_value_id", "type") SELECT "description", "discount_id", "id", "item_id", "metafield_definition_id", "metafield_value_id", "type" FROM "Metafield";
DROP TABLE "Metafield";
ALTER TABLE "new_Metafield" RENAME TO "Metafield";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;