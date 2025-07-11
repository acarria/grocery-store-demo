import { create } from 'zustand'

export interface CartItem {
  id: number
  name: string
  price: number
  image_url?: string
  quantity: number
  stock_quantity: number
}

interface CartState {
  cartItems: CartItem[]
  isCartOpen: boolean
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity: number) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  isCartOpen: false,
  addToCart: (item, quantity) => {
    set((state) => {
      const existing = state.cartItems.find((ci) => ci.id === item.id)
      let newCartItems
      if (existing) {
        newCartItems = state.cartItems.map((ci) =>
          ci.id === item.id
            ? { ...ci, quantity: Math.min(ci.quantity + quantity, ci.stock_quantity) }
            : ci
        )
      } else {
        newCartItems = [
          ...state.cartItems,
          { ...item, quantity: Math.min(quantity, item.stock_quantity) },
        ]
      }
      return {
        cartItems: newCartItems,
        isCartOpen: true, // Open cart on add
      }
    })
  },
  removeFromCart: (id) => {
    set((state) => ({ cartItems: state.cartItems.filter((ci) => ci.id !== id) }))
  },
  updateQuantity: (id, quantity) => {
    set((state) => ({
      cartItems: state.cartItems.map((ci) =>
        ci.id === id ? { ...ci, quantity: Math.max(1, Math.min(quantity, ci.stock_quantity)) } : ci
      ),
    }))
  },
  clearCart: () => set({ cartItems: [] }),
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
})) 