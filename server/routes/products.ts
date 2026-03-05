import { Router } from 'express'
import type { Response } from 'express'
import { supabaseAdmin } from '../supabase'
import { requireAdmin, type AuthRequest } from '../middleware/auth'

const router = Router()

// GET /api/products — 商品列表（分頁、分類篩選）
// 公開路由只顯示上架商品；管理員路由（/api/admin/products）顯示全部
router.get('/', async (req, res) => {
  const {
    category,
    featured,
    search,
    page = '1',
    limit = '20',
    sort = 'created_at',
    order = 'desc',
  } = req.query as Record<string, string>

  const isAdmin = req.baseUrl.includes('/admin')

  const pageNum = Math.max(1, parseInt(page))
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)))
  const from = (pageNum - 1) * limitNum
  const to = from + limitNum - 1

  let query = supabaseAdmin
    .from('products')
    .select('*, product_images(*)', { count: 'exact' })

  if (!isAdmin) query = query.eq('is_active', true)

  if (category) query = query.eq('category', category)
  if (featured === 'true') query = query.eq('is_featured', true)
  if (search) query = query.ilike('name', `%${search}%`)

  const { min_price, max_price } = req.query as Record<string, string>
  if (min_price) query = query.gte('price', parseFloat(min_price))
  if (max_price) query = query.lte('price', parseFloat(max_price))

  const validSorts = ['created_at', 'price', 'name']
  const sortField = validSorts.includes(sort) ? sort : 'created_at'
  const ascending = order === 'asc'

  query = query.order(sortField, { ascending }).range(from, to)

  const { data, error, count } = await query
  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  res.json({
    products: data || [],
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limitNum),
    },
  })
})

// GET /api/products/:id — 單一商品（含圖片）
// 公開路由只顯示上架商品；管理員路由顯示全部
router.get('/:id', async (req, res) => {
  const { id } = req.params
  const isAdmin = req.baseUrl.includes('/admin')

  let query = supabaseAdmin
    .from('products')
    .select('*, product_images(*)')
    .eq('id', id)

  if (!isAdmin) query = query.eq('is_active', true)

  const { data, error } = await query.single()

  if (error || !data) {
    res.status(404).json({ error: '找不到商品' })
    return
  }

  res.json(data)
})

// POST /api/admin/products — 管理員：新增商品
router.post('/', requireAdmin, async (req: AuthRequest, res: Response) => {
  const {
    name, slug, description, price, compare_at_price,
    category, brand, sku, stock_quantity,
    is_active, is_featured, specs, variants,
  } = req.body

  if (!name) {
    res.status(400).json({ error: '商品名稱為必填' })
    return
  }
  const finalSlug = slug || `product-${Date.now()}`

  const { data, error } = await supabaseAdmin
    .from('products')
    .insert({
      name, slug: finalSlug, description, price: price || 0,
      compare_at_price, category, brand, sku,
      stock_quantity: stock_quantity || 0,
      is_active: is_active ?? true,
      is_featured: is_featured ?? false,
      specs: specs || {},
      variants: variants || [],
    })
    .select()
    .single()

  if (error) {
    res.status(400).json({ error: error.message })
    return
  }

  res.status(201).json(data)
})

// PUT /api/admin/products/:id — 管理員：更新商品
router.put('/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  const { id } = req.params
  const updates = req.body

  delete updates.id
  delete updates.created_at
  delete updates.updated_at

  const { data, error } = await supabaseAdmin
    .from('products')
    .update(updates)
    .eq('id', id)
    .select('*, product_images(*)')
    .single()

  if (error) {
    res.status(400).json({ error: error.message })
    return
  }

  res.json(data)
})

// DELETE /api/admin/products/:id — 管理員：刪除商品
router.delete('/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  const { id } = req.params

  // 先刪除關聯的圖片記錄
  await supabaseAdmin
    .from('product_images')
    .delete()
    .eq('product_id', id)

  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    res.status(400).json({ error: error.message })
    return
  }

  res.json({ message: '商品已刪除' })
})

export default router
