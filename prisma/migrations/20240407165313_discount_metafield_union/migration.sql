-- CreateTable
CREATE TABLE "DiscountMetafieldUnion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "discount_id" TEXT NOT NULL,
    "metafield_id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    CONSTRAINT "DiscountMetafieldUnion_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "Discount" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DiscountMetafieldUnion_metafield_id_fkey" FOREIGN KEY ("metafield_id") REFERENCES "Metafield" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
