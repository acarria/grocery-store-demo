'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ProductCardCompact } from './product-card-compact'
import { ProductList } from './product-list'
import { ProductFilters } from './product-filters'
import { api } from '@/lib/api'

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

export const ProductGrid = React.memo(function ProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState('name_asc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  // Memoized callback functions to prevent unnecessary re-renders
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const handleCategoryChange = useCallback((categoryId: number | null) => {
    setSelectedCategory(categoryId)
  }, [])

  const handleSortChange = useCallback((sortBy: string) => {
    setSortBy(sortBy)
  }, [])

  const handleViewModeChange = useCallback((viewMode: 'grid' | 'list') => {
    setViewMode(viewMode)
  }, [])

  // Fetch all products once and filter locally
  const { data: allProducts, isLoading, error } = useQuery({
    queryKey: ['all-products'],
    queryFn: async () => {
      const response = await api.get('/api/v1/products/')
      return response.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  // Local search and filtering - no React Query involved
  const performLocalSearch = useCallback(async (query: string, categoryId: number | null) => {
    if (!allProducts) return
    let filtered = [...allProducts]
    // Apply search filter
    if (query.trim()) {
      const searchLower = query.toLowerCase()
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        (product.description && product.description.toLowerCase().includes(searchLower)) ||
        (product.category && product.category.name.toLowerCase().includes(searchLower))
      )
    }
    // Apply category filter
    if (categoryId) {
      filtered = filtered.filter(product => product.category?.id === categoryId)
    }
    setFilteredProducts(filtered)
  }, [allProducts])

  // Debounced search effect
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      performLocalSearch(searchQuery, selectedCategory)
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [searchQuery, selectedCategory, performLocalSearch])

  // Initialize filtered products when allProducts loads
  React.useEffect(() => {
    if (allProducts) {
      setFilteredProducts(allProducts)
    }
  }, [allProducts])

  // Memoized sorted products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts].sort((a: Product, b: Product) => {
      switch (sortBy) {
        case 'name_asc':
          return a.name.localeCompare(b.name)
        case 'name_desc':
          return b.name.localeCompare(a.name)
        case 'price_asc':
          return a.price - b.price
        case 'price_desc':
          return b.price - a.price
        default:
          return 0
      }
    })
    return sorted
  }, [filteredProducts, sortBy])

  // Memoized filter props to prevent ProductFilters re-renders
  const filterProps = useMemo(() => ({
    selectedCategory,
    onCategoryChange: handleCategoryChange,
    sortBy,
    onSortChange: handleSortChange,
    viewMode,
    onViewModeChange: handleViewModeChange,
    searchQuery,
    onSearchChange: handleSearchChange,
  }), [
    selectedCategory,
    handleCategoryChange,
    sortBy,
    handleSortChange,
    viewMode,
    handleViewModeChange,
    searchQuery,
    handleSearchChange,
  ])

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row">
        <ProductFilters {...filterProps} />
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="flex space-x-2">
                <div className="h-8 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-3 animate-pulse">
                <div className="h-36 bg-gray-200 rounded mb-3"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col md:flex-row">
        <ProductFilters {...filterProps} />
        <div className="flex-1">
          <div className="text-center py-8">
            <p className="text-red-600">Failed to load products</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row">
      <ProductFilters {...filterProps} />
      <div className="flex-1">
        {sortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
            {(selectedCategory || searchQuery) && (
              <div className="mt-4 space-x-4">
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-red-600 hover:text-red-700 underline"
                  >
                    Clear category filter
                  </button>
                )}
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-red-600 hover:text-red-700 underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <>
            {viewMode === 'list' ? (
              <ProductList products={sortedProducts} />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {sortedProducts.map((product: Product) => (
                  <ProductCardCompact key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}) 