import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { EyeOff, Eye } from 'lucide-react'
import { setUserToken, setUserEmail, getUserToken } from '../lib/api'
import { useStore } from '../contexts/StoreContext'

export default function Login() {
  const navigate = useNavigate()
  const store = useStore()
  const logoInitial = (store.brand_name || 'N')[0].toUpperCase()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (getUserToken()) {
      navigate('/', { replace: true })
    }
  }, [navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || ''}/api/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '登入失敗')

      setUserToken(data.access_token)
      setUserEmail(data.user.email)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : '登入失敗')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('兩次輸入的密碼不一致')
      return
    }
    if (password.length < 6) {
      setError('密碼至少需要 6 個字元')
      return
    }

    setLoading(true)

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || ''}/api/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name }),
        }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '註冊失敗')

      if (data.access_token) {
        setUserToken(data.access_token)
        setUserEmail(data.user.email)
        navigate('/', { replace: true })
      } else {
        setSuccess(data.message || '註冊成功！請登入。')
        setTab('login')
        setPassword('')
        setConfirmPassword('')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '註冊失敗')
    } finally {
      setLoading(false)
    }
  }

  const switchTab = (newTab: 'login' | 'register') => {
    setTab(newTab)
    setError('')
    setSuccess('')
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="p-8">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2">
            {store.logo_url ? (
              <img src={store.logo_url} alt="Logo" className="w-8 h-8 rounded-lg object-contain" />
            ) : (
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                {logoInitial}
              </div>
            )}
            <span className="font-bold text-lg leading-tight tracking-tight text-blue-900">{store.site_name || '奈斯達科技有限公司'}</span>
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">會員登入與註冊</h2>

        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => switchTab('login')}
            className={`flex-1 pb-4 text-center font-medium ${
              tab === 'login'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            登入
          </button>
          <button
            onClick={() => switchTab('register')}
            className={`flex-1 pb-4 text-center font-medium ${
              tab === 'register'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            註冊
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
            {success}
          </div>
        )}

        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">電子郵件</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="請輸入電子郵件"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">密碼</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="請輸入密碼"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? '登入中...' : '登入'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">姓名</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="請輸入姓名"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">電子郵件</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="請輸入電子郵件"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">密碼</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="請輸入密碼（至少 6 個字元）"
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">確認密碼</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="請再次輸入密碼"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? '註冊中...' : '註冊'}
            </button>
          </form>
        )}

        <div className="mt-8 text-center text-sm text-gray-600">
          {tab === 'login' ? (
            <>
              還沒有帳號？{' '}
              <button onClick={() => switchTab('register')} className="font-medium text-blue-600 hover:text-blue-500">
                立即註冊
              </button>
            </>
          ) : (
            <>
              已有帳號？{' '}
              <button onClick={() => switchTab('login')} className="font-medium text-blue-600 hover:text-blue-500">
                立即登入
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
