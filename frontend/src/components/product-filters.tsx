'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Filter, SortAsc, SortDesc } from 'lucide-react'
import { Button } from './ui/button'
import { SearchBar } from './search-bar'
import { api } from '@/lib/api'

interface Category {
  id: number
  name: string
  description?: string
}

interface ProductFiltersProps {
  selectedCategory: number | null
  onCategoryChange: (categoryId: number | null) => void
  sortBy: string
  onSortChange: (sortBy: string) => void
  viewMode: 'grid' | 'list'
  onViewModeChange: (viewMode: 'grid' | 'list') => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export const ProductFilters = React.memo(function ProductFilters({
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange
}: ProductFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/v1/categories/')
        setCategories(response.data)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCategories()
  }, [])

  const sortOptions = useMemo(() => [
    { value: 'name_asc', label: 'Name A-Z', icon: SortAsc },
    { value: 'name_desc', label: 'Name Z-A', icon: SortDesc },
    { value: 'price_asc', label: 'Price Low-High', icon: SortAsc },
    { value: 'price_desc', label: 'Price High-Low', icon: SortDesc },
  ], [])

  // Memoize categories to prevent unnecessary re-renders
  const memoizedCategories = useMemo(() => categories, [categories])

  // Handlers
  const handleCategoryClick = useCallback((categoryId: number | null) => {
    onCategoryChange(categoryId)
  }, [onCategoryChange])

  const handleSortClick = useCallback((sortValue: string) => {
    onSortChange(sortValue)
  }, [onSortChange])

  const handleGridViewClick = useCallback(() => {
    onViewModeChange('grid')
  }, [onViewModeChange])

  const handleListViewClick = useCallback(() => {
    onViewModeChange('list')
  }, [onViewModeChange])

  if (isLoading) {
    return (
      <aside className="hidden md:block md:w-64 md:sticky md:top-8 h-fit bg-white rounded-lg shadow-md p-4 mr-6 animate-pulse overflow-y-auto max-h-[calc(100vh-4rem)]">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-full"></div>
          <div className="h-8 bg-gray-200 rounded w-full"></div>
          <div className="h-8 bg-gray-200 rounded w-full"></div>
        </div>
      </aside>
    )
  }

  return (
    <aside className="hidden md:block md:w-64 md:sticky md:top-8 h-fit bg-white rounded-lg shadow-md p-4 mr-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          onSearch={onSearchChange}
          value={searchQuery}
          placeholder="Search for products, categories, or descriptions..."
          className="w-full"
        />
      </div>
      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Filter className="h-4 w-4 text-gray-600 mr-2" />
          <span className="text-sm font-semibold text-gray-700">Categories</span>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant={selectedCategory === null ? 'default' : 'outline'}
            className={`justify-start border transition-colors ${selectedCategory === null ? 'bg-red-100 text-red-700 border-red-500 font-bold' : ''}`}
            onClick={() => handleCategoryClick(null)}
          >
            All Categories
          </Button>
          {memoizedCategories.map((category) => (
            <Button
              type="button"
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              className={`justify-start border transition-colors ${selectedCategory === category.id ? 'bg-red-100 text-red-700 border-red-500 font-bold' : ''}`}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>
      {/* Sort Options */}
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <span className="text-sm font-semibold text-gray-700">Sort by</span>
        </div>
        <div className="flex flex-col gap-2">
          {sortOptions.map((option) => (
            <Button
              type="button"
              key={option.value}
              variant={sortBy === option.value ? 'default' : 'outline'}
              className={`justify-start border transition-colors ${sortBy === option.value ? 'bg-red-100 text-red-700 border-red-500 font-bold' : ''}`}
              onClick={() => handleSortClick(option.value)}
            >
              <span className="flex items-center gap-2">
                {option.icon && <option.icon className="h-4 w-4" />}
                {option.label}
              </span>
            </Button>
          ))}
        </div>
      </div>
      {/* View Mode Toggle */}
      <div className="mb-2">
        <div className="flex items-center mb-2">
          <span className="text-sm font-semibold text-gray-700">View</span>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            className={`border transition-colors ${viewMode === 'grid' ? 'bg-red-100 text-red-700 border-red-500 font-bold' : ''}`}
            onClick={handleGridViewClick}
          >
            Grid
          </Button>
          <Button
            type="button"
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            className={`border transition-colors ${viewMode === 'list' ? 'bg-red-100 text-red-700 border-red-500 font-bold' : ''}`}
            onClick={handleListViewClick}
          >
            List
          </Button>
        </div>
      </div>
    </aside>
  )
}) 