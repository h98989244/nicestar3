import { Router } from 'express'
import type { Response } from 'express'
import { supabaseAdmin } from '../supabase'
import { requireAdmin, type AuthRequest } from '../middleware/auth'

const router = Router()

// GET /api/categories — 公開，取得所有啟用分類（按 display_order 排序）
router.get('/', async (_req, res) => {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  res.json(data || [])
})

// GET /api/admin/categories — 管理員，取得所有分類
router.get('/admin-all', async (_req, res) => {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  res.json(data || [])
})

// POST /api/admin/categories — 管理員新增分類
router.post('/', requireAdmin, async (req: AuthRequest, res: Response) => {
  const { name, slug, icon, display_order, is_active } = req.body

  if (!name || !slug) {
    res.status(400).json({ error: '名稱和代碼為必填' })
    return
  }

  const { data, error } = await supabaseAdmin
    .from('categories')
    .insert({
      name,
      slug,
      icon: icon || '',
      display_order: display_order ?? 0,
      is_active: is_active ?? true,
    })
    .select()
    .single()

  if (error) {
    res.status(400).json({ error: error.message })
    return
  }

  res.status(201).json(data)
})

// PUT /api/admin/categories/:id — 管理員更新分類
router.put('/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  const { id } = req.params
  const { name, slug, icon, display_order, is_active } = req.body

  const updates: Record<string, unknown> = {}
  if (name !== undefined) updates.name = name
  if (slug !== undefined) updates.slug = slug
  if (icon !== undefined) updates.icon = icon
  if (display_order !== undefined) updates.display_order = display_order
  if (is_active !== undefined) updates.is_active = is_active

  const { data, error } = await supabaseAdmin
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    res.status(400).json({ error: error.message })
    return
  }

  res.json(data)
})

// DELETE /api/admin/categories/:id — 管理員刪除分類
router.delete('/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  const { id } = req.params

  const { error } = await supabaseAdmin
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) {
    res.status(400).json({ error: error.message })
    return
  }

  res.json({ message: '分類已刪除' })
})

export default router
