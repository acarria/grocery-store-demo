"use client"

import React, { useState, useCallback, useMemo } from 'react'
import { ProductGrid } from '@/components/product-grid'
import { Header } from '@/components/header'
import { Cart } from '@/components/cart'
import Image from 'next/image'
import { useCartStore } from '@/lib/cart-store'

export default function ShopPage() {
  const cartItems = useCartStore((state) => state.cartItems)
  const isCartOpen = useCartStore((state) => state.isCartOpen)
  const openCart = useCartStore((state) => state.openCart)
  const closeCart = useCartStore((state) => state.closeCart)
  const showSidebar = isCartOpen && cartItems.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <Header onCartClick={openCart} />
      <div className="flex flex-row w-full">
        {/* Main Content */}
        <main
          className={`container mx-auto px-4 py-8 transition-all duration-300 flex-1
            ${showSidebar ? 'md:mr-[370px]' : ''}
          `}
        >
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <Image
                src="/savego_logo.png"
                alt="SaveGo Wholesale Logo"
                width={80}
                height={80}
                className="rounded-lg shadow-md"
              />
            </div>
            <h1 className="text-5xl font-bold text-red-600 mb-4">Shop</h1>
            <p className="text-lg text-gray-700 mb-2">Discover our full selection of wholesale groceries</p>
          </div>
          <ProductGrid />
        </main>
        {/* Cart Sidebar (desktop) */}
        <div
          className={`hidden md:block fixed top-0 right-0 h-full z-50 transition-transform duration-300
            ${showSidebar ? 'translate-x-0' : 'translate-x-full'}
          `}
          style={{ width: 350 }}
        >
          <Cart isOpen={isCartOpen} onClose={closeCart} />
        </div>
      </div>
      {/* Cart Modal (mobile) */}
      <div className="md:hidden">
        <Cart isOpen={isCartOpen} onClose={closeCart} />
      </div>
    </div>
  )
} 