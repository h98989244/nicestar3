import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Product, CartItem } from '../types'

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantity?: number, selectedVariants?: Record<string, string>) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalCount: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | null>(null)

function loadCart(): CartItem[] {
  try {
    const data = localStorage.getItem('cart_items')
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem('cart_items', JSON.stringify(items))
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart)

  useEffect(() => {
    saveCart(items)
  }, [items])

  const addItem = (product: Product, quantity = 1, selectedVariants: Record<string, string> = {}) => {
    setItems(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity, selectedVariants }
            : item
        )
      }
      return [...prev, { product, quantity, selectedVariants }]
    })
  }

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => setItems([])

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalCount, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
