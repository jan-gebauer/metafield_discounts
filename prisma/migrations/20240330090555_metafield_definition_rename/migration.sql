/*
  Warnings:

  - You are about to drop the column `metafieldKey` on the `MetafieldDefinition` table. All the data in the column will be lost.
  - You are about to drop the column `metafieldName` on the `MetafieldDefinition` table. All the data in the column will be lost.
  - You are about to drop the column `metafieldNamespace` on the `MetafieldDefinition` table. All the data in the column will be lost.
  - Added the required column `key` to the `MetafieldDefinition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `MetafieldDefinition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `namespace` to the `MetafieldDefinition` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MetafieldDefinition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "namespace" TEXT NOT NULL,
    "key" TEXT NOT NULL
);
INSERT INTO "new_MetafieldDefinition" ("id") SELECT "id" FROM "MetafieldDefinition";
DROP TABLE "MetafieldDefinition";
ALTER TABLE "new_MetafieldDefinition" RENAME TO "MetafieldDefinition";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
