import { Router } from 'express'
import { supabaseAdmin } from '../supabase'

const router = Router()

// 產生訂單編號：NS + 日期 + 隨機碼
function generateOrderNumber(): string {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, '')
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `NS${date}${rand}`
}

// POST /api/orders — 建立訂單
router.post('/', async (req, res) => {
  try {
    const {
      recipient_name,
      recipient_phone,
      recipient_address,
      shipping_method = 'standard',
      shipping_cost,
      note = '',
      items,
    } = req.body

    if (!recipient_name || !recipient_phone || !recipient_address) {
      res.status(400).json({ error: '請填寫完整收件資訊' })
      return
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: '購物車不能為空' })
      return
    }

    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + Math.round(item.price * item.quantity),
      0
    )
    const total = subtotal + (shipping_cost ?? 80)
    const order_number = generateOrderNumber()

    // 從 Authorization header 取得 user_id（可選）
    let user_id: string | null = null
    const authHeader = req.headers.authorization
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7)
      try {
        const resp = await fetch(
          `${process.env.VITE_SUPABASE_URL}/auth/v1/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              apikey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
            },
          }
        )
        if (resp.ok) {
          const user = (await resp.json()) as { id: string }
          user_id = user.id
        }
      } catch {
        // 訪客結帳，不需要 user_id
      }
    }

    // 寫入訂單主表
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        order_number,
        user_id,
        recipient_name,
        recipient_phone,
        recipient_address,
        shipping_method,
        shipping_cost: shipping_cost ?? 80,
        subtotal,
        total,
        note,
        status: 'pending',
      })
      .select()
      .single()

    if (orderError || !order) {
      console.error('Create order error:', orderError)
      res.status(500).json({ error: '建立訂單失敗' })
      return
    }

    // 寫入訂單商品明細
    const orderItems = items.map(
      (item: {
        product_id: string
        product_name: string
        price: number
        quantity: number
        selected_variants: Record<string, string>
      }) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_price: item.price,
        quantity: item.quantity,
        selected_variants: item.selected_variants || {},
      })
    )

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Create order items error:', itemsError)
    }

    res.json({
      order_number: order.order_number,
      id: order.id,
      total: order.total,
      status: order.status,
      created_at: order.created_at,
    })
  } catch (err) {
    console.error('Order creation error:', err)
    res.status(500).json({ error: '建立訂單失敗' })
  }
})

// GET /api/orders/:orderNumber — 查詢訂單
router.get('/:orderNumber', async (req, res) => {
  try {
    const { orderNumber } = req.params

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .single()

    if (error || !order) {
      res.status(404).json({ error: '找不到此訂單' })
      return
    }

    const { data: items } = await supabaseAdmin
      .from('order_items')
      .select('*')
      .eq('order_id', order.id)

    res.json({ ...order, items: items || [] })
  } catch {
    res.status(500).json({ error: '查詢失敗' })
  }
})

export default router
