import { Router } from 'express'
import type { Response } from 'express'
import { requireAdmin, type AuthRequest } from '../middleware/auth'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || ''
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const router = Router()

// POST /api/admin/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({ error: '請提供 email 和密碼' })
    return
  }

  try {
    const resp = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
      },
      body: JSON.stringify({ email, password }),
    })

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error_description: '登入失敗' })) as { error_description?: string }
      res.status(401).json({ error: '登入失敗：' + (err.error_description || '未知錯誤') })
      return
    }

    const data = await resp.json() as {
      user: { id: string; email: string }
      access_token: string
      refresh_token: string
    }

    res.json({
      user: { id: data.user.id, email: data.user.email },
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    })
  } catch {
    res.status(500).json({ error: '登入服務錯誤' })
  }
})

// GET /api/admin/auth/me
router.get('/me', requireAdmin, (req: AuthRequest, res: Response) => {
  res.json({ user: req.user })
})

export default router
