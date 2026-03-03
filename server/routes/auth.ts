import { Router } from 'express'
import type { Response } from 'express'
import { supabaseAdmin } from '../supabase'
import { requireAdmin, type AuthRequest } from '../middleware/auth'

const router = Router()

// POST /api/admin/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({ error: '請提供 email 和密碼' })
    return
  }

  const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password })
  if (error) {
    res.status(401).json({ error: '登入失敗：' + error.message })
    return
  }

  res.json({
    user: { id: data.user.id, email: data.user.email },
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  })
})

// GET /api/admin/auth/me
router.get('/me', requireAdmin, (req: AuthRequest, res: Response) => {
  res.json({ user: req.user })
})

export default router
