/*
  Warnings:

  - The primary key for the `Metafield` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Metafield" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "item_id" TEXT NOT NULL,
    "namespace_key_id" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "type_id" INTEGER NOT NULL,
    "description" TEXT,
    CONSTRAINT "Metafield_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Metafield_namespace_key_id_fkey" FOREIGN KEY ("namespace_key_id") REFERENCES "NamespaceKey" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Metafield_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "MetafieldType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Metafield" ("description", "id", "item_id", "namespace_key_id", "type_id", "value") SELECT "description", "id", "item_id", "namespace_key_id", "type_id", "value" FROM "Metafield";
DROP TABLE "Metafield";
ALTER TABLE "new_Metafield" RENAME TO "Metafield";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;