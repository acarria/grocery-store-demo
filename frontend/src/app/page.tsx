'use client'

import { useState } from 'react'
import { Cart } from '@/components/cart'
import { Header } from '@/components/header'
import { useAuth } from '@/hooks/use-auth'
import Image from 'next/image'
import { ShoppingBag, Info, History, LifeBuoy } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { user, isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <Header onCartClick={() => setIsCartOpen(true)} />
      <main className="relative w-full min-h-[70vh] flex flex-col items-center justify-center">
        {/* Parallax Hero Section */}
        <div className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 w-full h-full bg-fixed bg-center bg-cover"
            style={{ backgroundImage: 'url(/hero.jpg)' }}
            aria-label="Grocery Store Hero"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
            <Image
              src="/savego_logo.png"
              alt="SaveGo Wholesale Logo"
              width={120}
              height={120}
              className="rounded-xl shadow-lg mb-4"
            />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">省够</h1>
            <p className="text-2xl md:text-3xl text-white mb-4 drop-shadow">SaveGo Wholesale</p>
            <p className="text-lg md:text-xl text-gray-200 mb-8 drop-shadow">Your trusted wholesale grocery partner</p>
            {/* Navigation Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl px-4">
              <Link href="/shop" className="group">
                <div className="flex flex-col items-center justify-center bg-white bg-opacity-90 rounded-xl shadow-lg p-6 hover:bg-red-100 transition cursor-pointer border-2 border-transparent group-hover:border-red-400">
                  <ShoppingBag className="h-8 w-8 text-red-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-lg font-semibold text-red-700 group-hover:underline">Shop</span>
                  <span className="text-xs text-gray-500 mt-1">Browse and buy groceries</span>
                </div>
              </Link>
              <Link href="/about" className="group">
                <div className="flex flex-col items-center justify-center bg-white bg-opacity-90 rounded-xl shadow-lg p-6 hover:bg-red-100 transition cursor-pointer border-2 border-transparent group-hover:border-red-400">
                  <Info className="h-8 w-8 text-red-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-lg font-semibold text-red-700 group-hover:underline">About Us</span>
                  <span className="text-xs text-gray-500 mt-1">Learn about our mission</span>
                </div>
              </Link>
              <Link href="/orders" className="group">
                <div className="flex flex-col items-center justify-center bg-white bg-opacity-90 rounded-xl shadow-lg p-6 hover:bg-red-100 transition cursor-pointer border-2 border-transparent group-hover:border-red-400">
                  <History className="h-8 w-8 text-red-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-lg font-semibold text-red-700 group-hover:underline">Order History</span>
                  <span className="text-xs text-gray-500 mt-1">View your past orders</span>
                </div>
              </Link>
              <Link href="/support" className="group">
                <div className="flex flex-col items-center justify-center bg-white bg-opacity-90 rounded-xl shadow-lg p-6 hover:bg-red-100 transition cursor-pointer border-2 border-transparent group-hover:border-red-400">
                  <LifeBuoy className="h-8 w-8 text-red-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-lg font-semibold text-red-700 group-hover:underline">Support</span>
                  <span className="text-xs text-gray-500 mt-1">Get help and contact us</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
} 