'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { api } from '@/lib/api'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
  value: string
}

export const SearchBar = React.memo(function SearchBar({
  onSearch,
  placeholder = "Search products...",
  className = "",
  value
}: SearchBarProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const suggestionsTimeoutRef = useRef<NodeJS.Timeout>()
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounced suggestions function
  const debouncedSuggestions = useCallback((query: string) => {
    if (suggestionsTimeoutRef.current) {
      clearTimeout(suggestionsTimeoutRef.current)
    }
    if (query.length >= 2) {
      suggestionsTimeoutRef.current = setTimeout(async () => {
        setIsLoading(true)
        try {
          const response = await api.get(`/api/v1/products/search/suggestions?query=${encodeURIComponent(query)}`)
          setSuggestions(response.data.suggestions)
          setShowSuggestions(response.data.suggestions.length > 0)
        } catch (error) {
          console.error('Failed to fetch suggestions:', error)
          setSuggestions([])
          setShowSuggestions(false)
        } finally {
          setIsLoading(false)
        }
      }, 200)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [])

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    onSearch(newQuery)
    debouncedSuggestions(newQuery)
  }, [onSearch, debouncedSuggestions])

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion: string) => {
    onSearch(suggestion)
    setShowSuggestions(false)
    if (inputRef.current) {
      inputRef.current.blur()
    }
  }, [onSearch])

  // Handle clear search
  const clearSearch = useCallback(() => {
    onSearch('')
    setSuggestions([])
    setShowSuggestions(false)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [onSearch])

  // Handle key events
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }, [])

  // Handle focus
  const handleFocus = useCallback(() => {
    if (value.length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true)
    }
  }, [value.length, suggestions.length])

  // Handle click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Cleanup timeouts on unmount
  React.useEffect(() => {
    return () => {
      if (suggestionsTimeoutRef.current) {
        clearTimeout(suggestionsTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className={`relative w-full ${className}`} ref={suggestionsRef}>
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-base"
        />
        {value && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
      {/* Search Suggestions */}
      {showSuggestions && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-3 text-center text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500 mx-auto"></div>
              <span className="ml-2">Loading suggestions...</span>
            </div>
          ) : (
            <>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center">
                    <Search className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-700">{suggestion}</span>
                  </div>
                </button>
              ))}
              {suggestions.length > 0 && (
                <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-100">
                  Click a suggestion or continue typing to search
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
})