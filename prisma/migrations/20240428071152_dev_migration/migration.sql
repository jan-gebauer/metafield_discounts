-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" TIMESTAMP(3),
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dmu" (
    "id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "discount_id" TEXT NOT NULL,
    "metafield_definition_id" TEXT NOT NULL,
    "metafield_value" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,

    CONSTRAINT "Dmu_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dmu_discount_id_metafield_definition_id_metafield_value_key" ON "Dmu"("discount_id", "metafield_definition_id", "metafield_value");
