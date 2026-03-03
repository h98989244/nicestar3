-- 商品表
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  compare_at_price DECIMAL(10,2),
  category TEXT DEFAULT '',
  brand TEXT DEFAULT '',
  sku TEXT UNIQUE,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  specs JSONB DEFAULT '{}',
  variants JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 商品圖片表
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_images_product_id ON product_images(product_id);

-- 店家資訊表（單列設計）
CREATE TABLE IF NOT EXISTS store_info (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  site_name TEXT DEFAULT '奈斯達科技有限公司',
  tax_id TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  address TEXT DEFAULT '',
  logo_url TEXT DEFAULT '',
  logo_storage_path TEXT DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 插入預設店家資訊
INSERT INTO store_info (id, site_name) VALUES (1, '奈斯達科技有限公司')
ON CONFLICT (id) DO NOTHING;

-- updated_at 自動更新 trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER store_info_updated_at
  BEFORE UPDATE ON store_info
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS 政策
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_info ENABLE ROW LEVEL SECURITY;

-- 公開可讀取上架商品
CREATE POLICY "Public can read active products"
  ON products FOR SELECT
  USING (is_active = true);

-- 公開可讀取所有商品圖片
CREATE POLICY "Public can read product images"
  ON product_images FOR SELECT
  USING (true);

-- 公開可讀取店家資訊
CREATE POLICY "Public can read store info"
  ON store_info FOR SELECT
  USING (true);

-- Storage buckets（需在 Supabase Dashboard 手動建立或用 API）
-- product-images: 公開 bucket
-- store-assets: 公開 bucket
