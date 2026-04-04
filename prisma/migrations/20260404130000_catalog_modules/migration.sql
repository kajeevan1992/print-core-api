ALTER TABLE "Product"
  ALTER COLUMN "categoryId" DROP NOT NULL,
  ALTER COLUMN "vendorId" SET DEFAULT '',
  ADD COLUMN IF NOT EXISTS "creationMethod" TEXT NOT NULL DEFAULT 'blank',
  ADD COLUMN IF NOT EXISTS "hotFolder" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "pdfFileUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "cmsPageLink" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "previewUrl" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "thumbnail" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "sortOrder" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "pages" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS "units" TEXT NOT NULL DEFAULT 'mm',
  ADD COLUMN IF NOT EXISTS "width" DOUBLE PRECISION NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "height" DOUBLE PRECISION NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "bleed" DOUBLE PRECISION NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "storefrontIds" JSONB,
  ADD COLUMN IF NOT EXISTS "lastSavedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "productNumbers" JSONB,
  ADD COLUMN IF NOT EXISTS "templateDefaults" JSONB,
  ADD COLUMN IF NOT EXISTS "templateSetup" JSONB,
  ADD COLUMN IF NOT EXISTS "templateAssets" JSONB,
  ADD COLUMN IF NOT EXISTS "priceMapping" JSONB,
  ADD COLUMN IF NOT EXISTS "comments" JSONB,
  ADD COLUMN IF NOT EXISTS "internalNotes" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "inventory" JSONB,
  ADD COLUMN IF NOT EXISTS "relatedProducts" JSONB,
  ADD COLUMN IF NOT EXISTS "attributes" JSONB,
  ADD COLUMN IF NOT EXISTS "alternateViews" JSONB;

CREATE TABLE IF NOT EXISTS "Category" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL DEFAULT '',
  "parentId" TEXT,
  "pricingId" TEXT NOT NULL DEFAULT '',
  "attributeSetId" TEXT NOT NULL DEFAULT '',
  "published" BOOLEAN NOT NULL DEFAULT true,
  "thumbnail" TEXT NOT NULL DEFAULT '',
  "friendlyUrl" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "accuZipConfig" TEXT NOT NULL DEFAULT '',
  "useAlternateMaster" BOOLEAN NOT NULL DEFAULT false,
  "canBrowse" BOOLEAN NOT NULL DEFAULT true,
  "canUpload" BOOLEAN NOT NULL DEFAULT false,
  "canUploadLater" BOOLEAN NOT NULL DEFAULT false,
  "canCreate" BOOLEAN NOT NULL DEFAULT true,
  "canCustom" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Category_friendlyUrl_key" ON "Category"("friendlyUrl");
CREATE INDEX IF NOT EXISTS "Category_parentId_idx" ON "Category"("parentId");
CREATE INDEX IF NOT EXISTS "Category_published_idx" ON "Category"("published");
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS "CategoryTag" (
  "id" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CategoryTag_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "CategoryTag_label_key" ON "CategoryTag"("label");

CREATE TABLE IF NOT EXISTS "CategoryTagMap" (
  "categoryId" TEXT NOT NULL,
  "tagId" TEXT NOT NULL,
  CONSTRAINT "CategoryTagMap_pkey" PRIMARY KEY ("categoryId","tagId")
);
ALTER TABLE "CategoryTagMap" ADD CONSTRAINT "CategoryTagMap_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CategoryTagMap" ADD CONSTRAINT "CategoryTagMap_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "CategoryTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS "Tag" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "parentId" TEXT,
  "friendlyUrl" TEXT NOT NULL,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "sidebar" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Tag_friendlyUrl_key" ON "Tag"("friendlyUrl");
CREATE INDEX IF NOT EXISTS "Tag_parentId_idx" ON "Tag"("parentId");
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Tag"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS "ProductTagMap" (
  "productId" TEXT NOT NULL,
  "tagId" TEXT NOT NULL,
  CONSTRAINT "ProductTagMap_pkey" PRIMARY KEY ("productId","tagId")
);
ALTER TABLE "ProductTagMap" ADD CONSTRAINT "ProductTagMap_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProductTagMap" ADD CONSTRAINT "ProductTagMap_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS "Collection" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Collection_title_key" ON "Collection"("title");

CREATE TABLE IF NOT EXISTS "CollectionProduct" (
  "collectionId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  CONSTRAINT "CollectionProduct_pkey" PRIMARY KEY ("collectionId","productId")
);
ALTER TABLE "CollectionProduct" ADD CONSTRAINT "CollectionProduct_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CollectionProduct" ADD CONSTRAINT "CollectionProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS "CollectionCategory" (
  "collectionId" TEXT NOT NULL,
  "categoryId" TEXT NOT NULL,
  CONSTRAINT "CollectionCategory_pkey" PRIMARY KEY ("collectionId","categoryId")
);
ALTER TABLE "CollectionCategory" ADD CONSTRAINT "CollectionCategory_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CollectionCategory" ADD CONSTRAINT "CollectionCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
