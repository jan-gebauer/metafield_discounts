-- CreateTable
CREATE TABLE "Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "handle" TEXT NOT NULL,
    "title" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "NamespaceKey" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "namespace" TEXT NOT NULL,
    "key" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Metafield" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "item_id" INTEGER NOT NULL,
    "namespace_key_id" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "type_id" INTEGER NOT NULL,
    "description" TEXT,
    CONSTRAINT "Metafield_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Metafield_namespace_key_id_fkey" FOREIGN KEY ("namespace_key_id") REFERENCES "NamespaceKey" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Metafield_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "MetafieldType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MetafieldType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Item_handle_key" ON "Item"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "NamespaceKey_namespace_key" ON "NamespaceKey"("namespace");

-- CreateIndex
CREATE UNIQUE INDEX "NamespaceKey_key_key" ON "NamespaceKey"("key");

-- CreateIndex
CREATE UNIQUE INDEX "MetafieldType_type_key" ON "MetafieldType"("type");
