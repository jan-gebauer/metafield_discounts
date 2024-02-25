/*
  Warnings:

  - You are about to drop the `MetafieldType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NamespaceKey` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `namespace_key_id` on the `Metafield` table. All the data in the column will be lost.
  - You are about to drop the column `type_id` on the `Metafield` table. All the data in the column will be lost.
  - Added the required column `key` to the `Metafield` table without a default value. This is not possible if the table is not empty.
  - Added the required column `namespace` to the `Metafield` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Metafield` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "MetafieldType_type_key";

-- DropIndex
DROP INDEX "NamespaceKey_key_key";

-- DropIndex
DROP INDEX "NamespaceKey_namespace_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MetafieldType";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "NamespaceKey";
PRAGMA foreign_keys=on;

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
    CONSTRAINT "Metafield_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Metafield" ("description", "id", "item_id", "value") SELECT "description", "id", "item_id", "value" FROM "Metafield";
DROP TABLE "Metafield";
ALTER TABLE "new_Metafield" RENAME TO "Metafield";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
