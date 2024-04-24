/*
  Warnings:

  - You are about to drop the column `metafield_value_id` on the `Dmu` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Dmu" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "discount_id" TEXT NOT NULL,
    "metafield_definition_id" TEXT NOT NULL,
    "metafield_value" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL
);
INSERT INTO "new_Dmu" ("active", "discount_id", "id", "metafield_definition_id", "metafield_value") SELECT "active", "discount_id", "id", "metafield_definition_id", "metafield_value" FROM "Dmu";
DROP TABLE "Dmu";
ALTER TABLE "new_Dmu" RENAME TO "Dmu";
CREATE UNIQUE INDEX "Dmu_discount_id_metafield_definition_id_metafield_value_key" ON "Dmu"("discount_id", "metafield_definition_id", "metafield_value");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
