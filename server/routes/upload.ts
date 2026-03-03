import { Router } from 'express'
import type { Response } from 'express'
import multer from 'multer'
import { supabaseAdmin } from '../supabase'
import { requireAdmin, type AuthRequest } from '../middleware/auth'

const router = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })

// POST /api/admin/upload/product-image — 上傳商品圖片
router.post(
  '/product-image',
  requireAdmin,
  upload.single('image'),
  async (req: AuthRequest, res: Response) => {
    const file = req.file
    if (!file) {
      res.status(400).json({ error: '請提供圖片檔案' })
      return
    }

    const { product_id, display_order = '0', is_primary = 'false' } = req.body
    if (!product_id) {
      res.status(400).json({ error: '請提供 product_id' })
      return
    }

    const ext = file.originalname.split('.').pop() || 'jpg'
    const fileName = `${product_id}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabaseAdmin.storage
      .from('product-images')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      })

    if (uploadError) {
      res.status(500).json({ error: '上傳失敗：' + uploadError.message })
      return
    }

    const { data: urlData } = supabaseAdmin.storage
      .from('product-images')
      .getPublicUrl(fileName)

    const { data, error } = await supabaseAdmin
      .from('product_images')
      .insert({
        product_id,
        storage_path: fileName,
        url: urlData.publicUrl,
        display_order: parseInt(display_order as string),
        is_primary: is_primary === 'true',
      })
      .select()
      .single()

    if (error) {
      res.status(500).json({ error: error.message })
      return
    }

    res.status(201).json(data)
  },
)

// DELETE /api/admin/upload/:path — 刪除圖片
router.delete('/*', requireAdmin, async (req: AuthRequest, res: Response) => {
  const storagePath = req.params[0]
  if (!storagePath) {
    res.status(400).json({ error: '請提供檔案路徑' })
    return
  }

  // 從 Storage 刪除
  const { error: storageError } = await supabaseAdmin.storage
    .from('product-images')
    .remove([storagePath])

  if (storageError) {
    res.status(500).json({ error: '刪除檔案失敗：' + storageError.message })
    return
  }

  // 從 DB 刪除記錄
  await supabaseAdmin
    .from('product_images')
    .delete()
    .eq('storage_path', storagePath)

  res.json({ message: '圖片已刪除' })
})

export default router
