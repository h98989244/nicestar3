const API_BASE = import.meta.env.VITE_API_URL || ''

// 前台公開 API 呼叫，後端不可用時回傳 null
let apiAvailable: boolean | null = null

export async function fetchPublic<T>(path: string): Promise<T | null> {
  if (apiAvailable === false) return null

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
    apiAvailable = true
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
