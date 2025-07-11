'use client'

import { ShoppingCart, User, LogIn } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface HeaderProps {
  onCartClick: () => void
}

export function Header({ onCartClick }: HeaderProps) {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-red-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <Image
                src="/savego_logo.png"
                alt="SaveGo Wholesale Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <div className="text-center">
                <h1 className="text-2xl font-bold text-red-600">省够</h1>
                <p className="text-xs text-gray-600">SaveGo Wholesale</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-700 hover:text-red-600 transition-colors font-medium">
                Home
              </a>
              <a href="/shop" className="text-gray-700 hover:text-red-600 transition-colors font-medium">
                Shop
              </a>
              {isAuthenticated && (
                <a href="/orders" className="text-gray-700 hover:text-red-600 transition-colors font-medium">
                  Orders
                </a>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCartClick}
                  className="relative border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="ml-2">Cart</span>
                </Button>
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-700 font-medium">
                    {user?.first_name || user?.email}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={logout}
                    className="text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                  >
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <a 
                  href="/login" 
                  className="text-sm text-gray-700 hover:text-red-600 transition-colors font-medium"
                >
                  Login
                </a>
                <Button 
                  asChild
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  <a href="/register">Register</a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 