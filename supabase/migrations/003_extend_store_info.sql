-- 擴充 store_info 欄位
ALTER TABLE store_info ADD COLUMN IF NOT EXISTS slogan TEXT DEFAULT '';
ALTER TABLE store_info ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE store_info ADD COLUMN IF NOT EXISTS email TEXT DEFAULT '';
ALTER TABLE store_info ADD COLUMN IF NOT EXISTS brand_name TEXT DEFAULT '';
ALTER TABLE store_info ADD COLUMN IF NOT EXISTS brand_subtitle TEXT DEFAULT '';

-- 更新預設資料
UPDATE store_info SET
  slogan = '智慧穿戴新未來',
  description = '致力於將科技融入生活，提供高品質的智慧穿戴設備與3C配件，打造無縫的智慧生活體驗。',
  email = 'support@nice-da.com',
  brand_name = 'nicestar3',
  brand_subtitle = 'TECHNOLOGY'
WHERE id = 1;
