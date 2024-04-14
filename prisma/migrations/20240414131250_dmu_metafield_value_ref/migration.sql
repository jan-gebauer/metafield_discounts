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
    CONSTRAINT "DiscountMetafieldUnion_metafield_value_id_fkey" FOREIGN KEY ("metafield_value_id") REFERENCES "MetafieldValue" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DiscountMetafieldUnion" ("active", "discount_id", "id", "metafield_definition_id", "metafield_value_id") SELECT "active", "discount_id", "id", "metafield_definition_id", "metafield_value_id" FROM "DiscountMetafieldUnion";
DROP TABLE "DiscountMetafieldUnion";
ALTER TABLE "new_DiscountMetafieldUnion" RENAME TO "DiscountMetafieldUnion";
CREATE UNIQUE INDEX "DiscountMetafieldUnion_discount_id_metafield_definition_id_metafield_value_id_key" ON "DiscountMetafieldUnion"("discount_id", "metafield_definition_id", "metafield_value_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
