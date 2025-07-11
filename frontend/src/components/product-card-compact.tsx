'use client'

import { useState } from 'react'
import { ShoppingCart, AlertCircle } from 'lucide-react'
import { Button } from './ui/button'
import Image from 'next/image'
import { useCartStore } from '@/lib/cart-store'

interface Product {
  id: number
  name: string
  description?: string
  price: number
  stock_quantity: number
  image_url?: string
  is_active: boolean
  category?: {
    id: number
    name: string
  }
}

interface ProductCardCompactProps {
  product: Product
}

export function ProductCardCompact({ product }: ProductCardCompactProps) {
  const [quantity, setQuantity] = useState(1)
  const [imageError, setImageError] = useState(false)
  const [added, setAdded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isOutOfStock = product.stock_quantity === 0
  const isLowStock = product.stock_quantity <= 10 && product.stock_quantity > 0

  const addToCart = useCartStore((state) => state.addToCart)

  const handleAddToCart = () => {
    if (quantity > product.stock_quantity) {
      setError(`Only ${product.stock_quantity} in stock.`)
      setTimeout(() => setError(null), 2000)
      return
    }
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        stock_quantity: product.stock_quantity,
      },
      quantity
    )
    setAdded(true)
    setError(null)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="relative">
        {product.image_url && !imageError ? (
          <Image
            src={product.image_url}
            alt={product.name}
            width={300}
            height={144}
            className="w-full h-36 object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-36 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-center px-2 text-sm">{product.name}</span>
          </div>
        )}
        {/* Tag Row */}
        <div className="flex flex-wrap gap-1 absolute top-2 left-2 right-2 z-10">
          {product.category && (
            <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs font-medium truncate max-w-[80px] border border-red-200">
              {product.category.name}
            </span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="bg-yellow-500 text-white px-2 py-0.5 rounded text-xs font-medium truncate max-w-[80px] border border-yellow-400 flex items-center">
              Low Stock
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-medium truncate max-w-[80px] border border-red-600 flex items-center">
              Out of Stock
            </span>
          )}
        </div>
        {/* Image overlay for out of stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-20 z-0"></div>
        )}
      </div>

      <div className="p-3 flex-1 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-gray-600 text-xs mb-2 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-red-600">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-xs text-gray-500">
            {product.stock_quantity} in stock
          </span>
        </div>

        {!isOutOfStock && (
          <div className="flex items-center space-x-2 mb-3">
            <label htmlFor={`quantity-compact-${product.id}`} className="text-xs font-medium">
              Qty:
            </label>
            <select
              id={`quantity-compact-${product.id}`}
              value={quantity}
              onChange={(e) => setQuantity(Math.min(Number(e.target.value), product.stock_quantity))}
              className="border rounded px-1 py-1 text-xs"
            >
              {[...Array(Math.min(5, product.stock_quantity))].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mt-auto">
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full text-base py-2 font-bold shadow-md transition-all duration-150
              bg-gradient-to-r from-red-600 to-red-700 text-white border-none
              hover:from-red-700 hover:to-red-800 hover:scale-105
              active:scale-95
              ${isOutOfStock ? 'opacity-60 cursor-not-allowed' : ''}`}
            size="lg"
          >
            {added ? (
              <span className="flex items-center justify-center w-full">
                <svg className="h-5 w-5 mr-1 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Added!
              </span>
            ) : (
              <span className="flex items-center justify-center w-full">
                <ShoppingCart className="h-5 w-5 mr-1" />
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </span>
            )}
          </Button>
          {error && (
            <div className="text-xs text-red-600 mt-2 text-center font-semibold">{error}</div>
          )}
        </div>
      </div>
    </div>
  )
} 