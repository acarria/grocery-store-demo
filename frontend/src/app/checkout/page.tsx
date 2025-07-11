'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/cart-store'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'

export default function CheckoutPage() {
  const cartItems = useCartStore((state) => state.cartItems)
  const clearCart = useCartStore((state) => state.clearCart)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeFromCart = useCartStore((state) => state.removeFromCart)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (cartItems.length === 0) {
      router.replace('/shop')
    }
  }, [cartItems, router])

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (cartItems.length === 0) {
    if (typeof window !== 'undefined') router.replace('/shop')
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      // Placeholder: Replace with real API call
      const res = await fetch('/api/v1/orders/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: cartItems.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.detail || 'Order failed. Please try again.')
      } else {
        setSuccess(true)
        clearCart()
      }
    } catch (err) {
      setError('Order failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex flex-col items-center py-8 px-2">
      <div className="w-full max-w-2xl mb-4 flex justify-start">
        <Link href="/shop" className="text-sm text-red-600 hover:underline font-medium px-3 py-2 rounded hover:bg-red-50 transition">
          &larr; Continue Shopping
        </Link>
      </div>
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-red-600 mb-6 text-center">Checkout</h1>
        {/* Order Summary */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center space-x-3 border rounded p-2">
                <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                  {item.image_url ? (
                    <Image src={item.image_url} alt={item.name} width={48} height={48} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{item.name}</div>
                  <div className="flex items-center mt-1 space-x-2">
                    <Button
                      type="button"
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
                      type="button"
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
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="text-red-500 hover:bg-red-100"
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove from cart"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                  <div className="font-semibold text-red-600">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center border-t pt-3 mt-3">
            <span className="font-semibold">Total:</span>
            <span className="font-bold text-lg text-red-700">${total.toFixed(2)}</span>
          </div>
        </div>
        {/* Shipping/Contact Info */}
        <form onSubmit={handleSubmit} className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Shipping & Contact Info</h2>
          <div className="space-y-3">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Full Name"
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Email"
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder="Phone Number"
              className="w-full border rounded px-3 py-2"
            />
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              placeholder="Shipping Address"
              className="w-full border rounded px-3 py-2 min-h-[80px]"
            />
          </div>
          <div className="flex justify-center mt-8">
            <Button
              type="submit"
              className="bg-gradient-to-r from-red-600 to-red-700 text-white font-bold px-8 py-3 rounded-lg text-lg shadow hover:from-red-700 hover:to-red-800 hover:scale-105 transition-all"
              disabled={loading}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </Button>
          </div>
        </form>
        {/* Payment Section Placeholder */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Payment</h2>
          <div className="bg-gray-50 border rounded p-4 text-gray-500 text-center">
            Payment integration coming soon (Stripe Elements goes here)
          </div>
        </div>
        {error && <div className="text-red-600 text-center mt-4 font-semibold">{error}</div>}
        {success && <div className="text-green-600 text-center mt-4 font-semibold">Order placed successfully!</div>}
      </div>
    </div>
  )
} 