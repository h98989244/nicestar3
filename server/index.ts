import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import productsRouter from './routes/products'
import storeInfoRouter from './routes/store-info'
import uploadRouter from './routes/upload'
import authRouter from './routes/auth'
import { requireAdmin } from './middleware/auth'

dotenv.config({ path: '.env.local' })

const app = express()
const port = parseInt(process.env.API_PORT || '3001')

app.use(cors())
app.use(express.json())

// 公開路由
app.use('/api/products', productsRouter)
app.use('/api/store-info', storeInfoRouter)

// 管理員路由
app.use('/api/admin/auth', authRouter)
app.use('/api/admin/products', requireAdmin, productsRouter)
app.use('/api/admin/upload', uploadRouter)
app.use('/api/admin/store-info', storeInfoRouter)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`)
})

export default app
