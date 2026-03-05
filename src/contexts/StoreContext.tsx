import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { fetchPublic } from '../lib/api'
import type { StoreInfo } from '../types'

const defaults: StoreInfo = {
  id: 1,
  site_name: '',
  slogan: '',
  description: '',
  email: '',
  brand_name: '',
  brand_subtitle: '',
  tax_id: '',
  phone: '',
  address: '',
  logo_url: '',
  logo_storage_path: '',
  updated_at: '',
}

const StoreContext = createContext<StoreInfo>(defaults)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<StoreInfo>(defaults)

  useEffect(() => {
    fetchPublic<StoreInfo>('/api/store-info')
      .then(data => {
        if (data) setStore(data)
      })
      .catch(() => {})
  }, [])

  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  return useContext(StoreContext)
}
