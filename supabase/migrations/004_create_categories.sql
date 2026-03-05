-- 建立分類資料表
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed 現有 7 個分類
INSERT INTO categories (name, slug, icon, display_order) VALUES
  ('手機殼', 'cases', 'Smartphone', 1),
  ('錶帶', 'bands', 'Watch', 2),
  ('充電器', 'chargers', 'BatteryCharging', 3),
  ('螢幕保護貼', 'protectors', 'Shield', 4),
  ('耳機', 'audio', 'Headphones', 5),
  ('行動電源', 'powerbanks', 'Zap', 6),
  ('配件', 'accessories', 'Plus', 7);
