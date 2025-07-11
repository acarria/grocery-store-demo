'use client'

import { useState } from 'react'
import { X, ShoppingCart } from 'lucide-react'
import { Button } from './ui/button'
import { useCartStore } from '@/lib/cart-store'
import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface CartProps {
  isOpen: boolean
  onClose: () => void
}

export function Cart({ isOpen, onClose }: CartProps) {
  const cartItems = useCartStore((state) => state.cartItems)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeFromCart = useCartStore((state) => state.removeFromCart)
  const clearCart = useCartStore((state) => state.clearCart)
  const closeCart = useCartStore((state) => state.closeCart)
  const router = useRouter()

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // On mobile, hide if not open and cart is empty
  if (typeof window !== 'undefined' && window.innerWidth < 768 && (!isOpen && cartItems.length === 0)) return null

  return (
    <div className="flex flex-col h-full w-full max-w-md bg-white shadow-lg z-50">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Shopping Cart
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-3 border rounded-lg bg-gray-50">
                <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-white border">
                  {item.image_url ? (
                    <Image src={item.image_url} alt={item.name} width={64} height={64} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                  <div className="text-xs text-gray-500">${item.price.toFixed(2)}</div>
                  <div className="flex items-center mt-2 space-x-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-6 w-6 p-0"
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      -
                    </Button>
                    <input
                      type="number"
                      min={1}
                      max={item.stock_quantity}
                      value={item.quantity}
                      onChange={e => {
                        let val = Number(e.target.value)
                        if (isNaN(val)) val = 1
                        updateQuantity(item.id, Math.max(1, Math.min(val, item.stock_quantity)))
                      }}
                      className="w-10 text-center border rounded h-6 text-xs"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-6 w-6 p-0"
                      onClick={() => updateQuantity(item.id, Math.min(item.stock_quantity, item.quantity + 1))}
                      disabled={item.quantity >= item.stock_quantity}
                      aria-label="Increase quantity"
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-500 hover:bg-red-100"
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove from cart"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                  <div className="text-xs font-semibold text-gray-700">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {cartItems.length > 0 && (
        <div className="p-4 border-t bg-white">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">Total:</span>
            <span className="font-semibold text-lg text-red-600">${total.toFixed(2)}</span>
          </div>
          <div className="flex gap-2 mb-2">
            <Button
              variant="outline"
              className="w-1/2 text-red-600 border-red-300 hover:bg-red-50"
              onClick={clearCart}
            >
              Clear Cart
            </Button>
            <Button
              className="w-1/2 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold hover:from-red-700 hover:to-red-800 hover:scale-105 transition-all"
              onClick={() => {
                closeCart()
                router.push('/checkout')
              }}
            >
              Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 