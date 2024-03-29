/*
  Warnings:

  - You are about to drop the column `percentage` on the `Discount` table. All the data in the column will be lost.
  - You are about to drop the column `startsAt` on the `Discount` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Discount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL
);
INSERT INTO "new_Discount" ("id", "summary", "title") SELECT "id", "summary", "title" FROM "Discount";
DROP TABLE "Discount";
ALTER TABLE "new_Discount" RENAME TO "Discount";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
