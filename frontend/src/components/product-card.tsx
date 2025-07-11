'use client'

import { useState } from 'react'
import { ShoppingCart, AlertCircle } from 'lucide-react'
import { Button } from './ui/button'
import Image from 'next/image'

interface Product {
  id: number
  name: string
  description?: string
  price: number
  stock_quantity: number
  image_url?: string
  is_active: boolean
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [imageError, setImageError] = useState(false)
  const isOutOfStock = product.stock_quantity === 0
  const isLowStock = product.stock_quantity <= 10 && product.stock_quantity > 0

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', product.id, quantity)
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="relative">
        {product.image_url && !imageError ? (
          <Image
            src={product.image_url}
            alt={product.name}
            width={400}
            height={192}
            className="w-full h-48 object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-center px-2">{product.name}</span>
          </div>
        )}
        
        {isOutOfStock && (
          <>
            <div className="absolute inset-0 bg-black bg-opacity-20 z-0"></div>
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium z-10">
              Out of Stock
            </div>
          </>
        )}
        
        {isLowStock && !isOutOfStock && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-sm font-medium z-10">
            Low Stock
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-red-600">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500">
            {product.stock_quantity} in stock
          </span>
        </div>

        {!isOutOfStock && (
          <div className="flex items-center space-x-2 mb-4">
            <label htmlFor={`quantity-${product.id}`} className="text-sm font-medium">
              Quantity:
            </label>
            <select
              id={`quantity-${product.id}`}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
            >
              {[...Array(Math.min(10, product.stock_quantity))].map((_, i) => (
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
            className="w-full"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </Button>

          {isLowStock && !isOutOfStock && (
            <div className="flex items-center mt-2 text-yellow-600 text-sm">
              <AlertCircle className="h-4 w-4 mr-1" />
              Only {product.stock_quantity} left!
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 