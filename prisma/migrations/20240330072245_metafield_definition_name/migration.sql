/*
  Warnings:

  - Added the required column `metafieldName` to the `MetafieldDefinition` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MetafieldDefinition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "metafieldName" TEXT NOT NULL,
    "metafieldNamespace" TEXT NOT NULL,
    "metafieldKey" TEXT NOT NULL
);
INSERT INTO "new_MetafieldDefinition" ("id", "metafieldKey", "metafieldNamespace") SELECT "id", "metafieldKey", "metafieldNamespace" FROM "MetafieldDefinition";
DROP TABLE "MetafieldDefinition";
ALTER TABLE "new_MetafieldDefinition" RENAME TO "MetafieldDefinition";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
