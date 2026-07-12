ALTER TABLE "Product"
ADD COLUMN "searchVector" tsvector GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce("title", '')), 'A') ||
  setweight(to_tsvector('english', coalesce("description", '')), 'C')
) STORED;

CREATE INDEX "Product_searchVector_idx" ON "Product" USING GIN ("searchVector");
