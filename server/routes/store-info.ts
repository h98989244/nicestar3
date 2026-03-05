import { Router } from 'express'
import type { Response } from 'express'
import { supabaseAdmin } from '../supabase'
import { requireAdmin, type AuthRequest } from '../middleware/auth'

const router = Router()

// GET /api/store-info — 公開：取得店家資訊
router.get('/', async (_req, res) => {
  const { data, error } = await supabaseAdmin
    .from('store_info')
    .select('*')
    .eq('id', 1)
    .single()

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  res.json(data)
})

// PUT /api/admin/store-info — 管理員：更新店家資訊
router.put('/', requireAdmin, async (req: AuthRequest, res: Response) => {
  const {
    site_name, slogan, description, email, brand_name, brand_subtitle,
    tax_id, phone, address, logo_url, logo_storage_path,
  } = req.body

  const { data, error } = await supabaseAdmin
    .from('store_info')
    .update({
      site_name, slogan, description, email, brand_name, brand_subtitle,
      tax_id, phone, address, logo_url, logo_storage_path,
    })
    .eq('id', 1)
    .select()
    .single()

  if (error) {
    res.status(400).json({ error: error.message })
    return
  }

  res.json(data)
})

export default router
