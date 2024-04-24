-- CreateTable
CREATE TABLE "Dmu" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "discount_id" TEXT NOT NULL,
    "metafield_definition_id" TEXT NOT NULL,
    "metafield_value" TEXT NOT NULL,
    "metafield_value_id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Dmu_discount_id_metafield_definition_id_metafield_value_id_key" ON "Dmu"("discount_id", "metafield_definition_id", "metafield_value_id");
