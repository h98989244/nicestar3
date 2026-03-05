export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  compare_at_price: number | null
  category: string
  brand: string
  sku: string | null
  stock_quantity: number
  is_active: boolean
  is_featured: boolean
  specs: Record<string, string>
  variants: ProductVariant[]
  product_images: ProductImage[]
  created_at: string
  updated_at: string
}

export interface ProductVariant {
  name: string
  options: string[]
}

export interface ProductImage {
  id: string
  product_id: string
  storage_path: string
  url: string
  display_order: number
  is_primary: boolean
  created_at: string
}

export interface StoreInfo {
  id: number
  site_name: string
  tax_id: string
  phone: string
  address: string
  logo_url: string
  logo_storage_path: string
  updated_at: string
}

export interface PaginatedResponse<T> {
  products: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CartItem {
  product: Product
  quantity: number
  selectedVariants: Record<string, string>
}

export interface AuthResponse {
  user: { id: string; email: string }
  access_token: string
  refresh_token: string
}
