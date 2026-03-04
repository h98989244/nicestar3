import type { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const adminEmails = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map(e => e.trim())
  .filter(Boolean)

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || ''

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

  // 直接呼叫 Supabase REST API 驗證 token，避免 supabase-js client 狀態污染
  try {
    const resp = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY || '',
      },
    })

    if (!resp.ok) {
      res.status(401).json({ error: '無效的授權令牌' })
      return
    }

    const user = await resp.json() as { id: string; email?: string }
    const email = user.email || ''

    if (adminEmails.length > 0 && !adminEmails.includes(email)) {
      res.status(403).json({ error: '無管理員權限' })
      return
    }

    req.user = { id: user.id, email }
    next()
  } catch {
    res.status(401).json({ error: '驗證失敗' })
  }
}
