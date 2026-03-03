const API_BASE = import.meta.env.VITE_API_URL || ''

// 前台公開 API 呼叫，後端不可用時回傳 null
let apiAvailable: boolean | null = null

// 透過 HEAD 請求探測後端是否可用（不會在 console 產生 404 錯誤內容）
async function probeApi(): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 2000)
    const res = await fetch(`${API_BASE}/api/health`, {
      method: 'HEAD',
      signal: controller.signal,
    })
    clearTimeout(timer)
    return res.ok
  } catch {
    return false
  }
}

export async function fetchPublic<T>(path: string): Promise<T | null> {
  if (apiAvailable === false) return null

  // 首次呼叫時先探測後端
  if (apiAvailable === null) {
    apiAvailable = await probeApi()
    if (!apiAvailable) return null
  }

  try {
    const res = await fetch(`${API_BASE}${path}`)
    if (!res.ok) {
      apiAvailable = false
      return null
    }
    const contentType = res.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      apiAvailable = false
      return null
    }
    const data = await res.json()
    return data as T
  } catch {
    apiAvailable = false
    return null
  }
}

function getToken(): string | null {
  return localStorage.getItem('admin_token')
}

export function setToken(token: string) {
  localStorage.setItem('admin_token', token)
}

export function clearToken() {
  localStorage.removeItem('admin_token')
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // 如果 body 不是 FormData，設定 JSON content-type
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: '請求失敗' }))
    throw new Error(body.error || `HTTP ${res.status}`)
  }

  return res.json()
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
