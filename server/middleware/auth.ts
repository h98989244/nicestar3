import type { Request, Response, NextFunction } from 'express'
import { supabaseAdmin } from '../supabase'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const adminEmails = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map(e => e.trim())
  .filter(Boolean)

export interface AuthRequest extends Request {
  user?: { id: string; email: string }
}

export async function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: '未提供授權令牌' })
    return
  }

  const token = authHeader.slice(7)

  const { data, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !data.user) {
    res.status(401).json({ error: '無效的授權令牌' })
    return
  }

  const email = data.user.email || ''
  if (adminEmails.length > 0 && !adminEmails.includes(email)) {
    res.status(403).json({ error: '無管理員權限' })
    return
  }

  req.user = { id: data.user.id, email }
  next()
}
