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
  category?: {
    id: number
    name: string
  }
}

interface ProductListProps {
  products: Product[]
}

export function ProductList({ products }: ProductListProps) {
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({})
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({})

  const handleQuantityChange = (productId: number, quantity: number) => {
    setQuantities(prev => ({ ...prev, [productId]: quantity }))
  }

  const handleImageError = (productId: number) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }))
  }

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', product.id, quantity)
  }

  return (
    <div className="space-y-4">
      {products.map((product) => {
        const isOutOfStock = product.stock_quantity === 0
        const isLowStock = product.stock_quantity <= 10 && product.stock_quantity > 0
        const quantity = quantities[product.id] || 1

        return (
          <div key={product.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-6">
              {/* Product Image */}
              <div className="flex-shrink-0">
                {product.image_url && !imageErrors[product.id] ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    width={120}
                    height={120}
                    className="w-30 h-30 object-cover rounded-lg"
                    onError={() => handleImageError(product.id)}
                  />
                ) : (
                  <div className="w-30 h-30 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-center px-2 text-sm">{product.name}</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    {product.category && (
                      <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mb-2">
                        {product.category.name}
                      </span>
                    )}
                    {product.description && (
                      <p className="text-gray-600 text-sm mb-3">
                        {product.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl font-bold text-red-600">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {product.stock_quantity} in stock
                      </span>
                      {isLowStock && !isOutOfStock && (
                        <div className="flex items-center text-yellow-600 text-sm">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Only {product.stock_quantity} left!
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Add to Cart Section */}
                  <div className="flex-shrink-0 ml-6">
                    {!isOutOfStock && (
                      <div className="flex items-center space-x-2 mb-4">
                        <label htmlFor={`quantity-${product.id}`} className="text-sm font-medium">
                          Qty:
                        </label>
                        <select
                          id={`quantity-${product.id}`}
                          value={quantity}
                          onChange={(e) => handleQuantityChange(product.id, Number(e.target.value))}
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

                    <Button
                      onClick={() => handleAddToCart(product)}
                      disabled={isOutOfStock}
                      className="w-full"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {isOutOfStock && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center text-red-600">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">This item is currently out of stock</span>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
} 