import serverless from 'serverless-http'
import express from 'express'
import type { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import productsRouter from './routes/products'
import storeInfoRouter from './routes/store-info'
import uploadRouter from './routes/upload'
import authRouter from './routes/auth'

const app = express()

app.use(cors())

// 自訂 body 解析：完全繞過 body-parser 的 content-length 檢查
// serverless-http + API Gateway 會導致 content-length 與實際 body 大小不一致
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.method === 'GET' || req.method === 'DELETE' || req.method === 'OPTIONS') {
    return next()
  }

  const contentType = req.headers['content-type'] || ''
  // 跳過 multipart（由 multer 處理）
  if (contentType.includes('multipart/form-data')) {
    return next()
  }

  const chunks: Buffer[] = []
  req.on('data', (chunk: Buffer) => chunks.push(chunk))
  req.on('end', () => {
    const raw = Buffer.concat(chunks).toString('utf-8')
    if (raw && contentType.includes('application/json')) {
      try {
        req.body = JSON.parse(raw)
      } catch {
        req.body = {}
      }
    }
    next()
  })
  req.on('error', () => next())
})

// 公開路由
app.use('/api/products', productsRouter)
app.use('/api/store-info', storeInfoRouter)

// 管理員路由
app.use('/api/admin/auth', authRouter)
app.use('/api/admin/products', productsRouter)
app.use('/api/admin/upload', uploadRouter)
app.use('/api/admin/store-info', storeInfoRouter)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export const handler = serverless(app, {
  binary: ['multipart/form-data', 'image/*'],
})
