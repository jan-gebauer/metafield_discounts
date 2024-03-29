/*
  Warnings:

  - Added the required column `discount_id` to the `Metafield` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Discount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "percentage" BIGINT NOT NULL,
    "summary" TEXT NOT NULL,
    "startsAt" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Metafield" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "item_id" TEXT NOT NULL,
    "namespace" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "discount_id" TEXT NOT NULL,
    CONSTRAINT "Metafield_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Metafield_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "Discount" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Metafield" ("description", "id", "item_id", "key", "namespace", "type", "value") SELECT "description", "id", "item_id", "key", "namespace", "type", "value" FROM "Metafield";
DROP TABLE "Metafield";
ALTER TABLE "new_Metafield" RENAME TO "Metafield";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
