import { Router } from 'express'
import type { Response } from 'express'
import { requireUser, type AuthRequest } from '../middleware/auth'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || ''
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const router = Router()

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body
  if (!email || !password) {
    res.status(400).json({ error: '請提供 email 和密碼' })
    return
  }

  try {
    // 使用 admin API 建立用戶（自動確認，無需信箱驗證）
    const resp = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
        user_metadata: { display_name: name || '' },
      }),
    })

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ msg: '註冊失敗' })) as { msg?: string; message?: string }
      const errMsg = err.msg || err.message || '註冊失敗'
      // 重複 email
      if (errMsg.includes('already been registered') || errMsg.includes('already exists')) {
        res.status(400).json({ error: '此 email 已被註冊' })
        return
      }
      res.status(400).json({ error: errMsg })
      return
    }

    // 建立成功後自動登入取得 token
    const loginResp = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
      },
      body: JSON.stringify({ email, password }),
    })

    if (loginResp.ok) {
      const loginData = await loginResp.json() as {
        user: { id: string; email: string }
        access_token: string
        refresh_token: string
      }
      res.status(201).json({
        user: { id: loginData.user.id, email: loginData.user.email },
        access_token: loginData.access_token,
        refresh_token: loginData.refresh_token,
      })
    } else {
      res.status(201).json({ message: '註冊成功，請登入' })
    }
  } catch {
    res.status(500).json({ error: '註冊服務錯誤' })
  }
})

// POST /api/auth/login
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
      res.status(401).json({ error: '登入失敗：' + (err.error_description || '帳號或密碼錯誤') })
      return
    }

    const data = await resp.json() as {
      user: { id: string; email: string; user_metadata?: { display_name?: string } }
      access_token: string
      refresh_token: string
    }

    res.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.display_name || '',
      },
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    })
  } catch {
    res.status(500).json({ error: '登入服務錯誤' })
  }
})

// GET /api/auth/me
router.get('/me', requireUser, (req: AuthRequest, res: Response) => {
  res.json({ user: req.user })
})

export default router
