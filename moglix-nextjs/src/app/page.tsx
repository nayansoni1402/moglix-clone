'use client';

import { useQuery } from '@tanstack/react-query';
import { strapi } from '@/lib/strapi';
import { Product, StrapiResponse } from '@/types';
import ProductCard from '@/components/ProductCard';
import { Search, Menu, User, ShoppingCart, Heart } from 'lucide-react';

async function fetchProducts() {
  const { data } = await strapi.get<StrapiResponse<Product[]>>('/products', {
    params: {
      populate: ['images', 'brand', 'category'],
    },
  });
  return data.data;
}

export default function Home() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Menu className="h-6 w-6 text-gray-700 md:hidden" />
            <div className="text-2xl font-black text-red-600 italic tracking-tighter">
              MOGLIX
            </div>
          </div>
          
          <div className="hidden flex-1 md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for Products, Brands, Categories..."
                className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 pl-10 text-sm focus:border-red-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center gap-6 text-gray-700">
            <div className="hidden flex-col items-center gap-0.5 sm:flex cursor-pointer hover:text-red-600">
              <User className="h-5 w-5" />
              <span className="text-[10px] font-bold">Login</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 cursor-pointer hover:text-red-600">
              <Heart className="h-5 w-5" />
              <span className="text-[10px] font-bold">Wishlist</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 relative cursor-pointer hover:text-red-600">
              <ShoppingCart className="h-5 w-5" />
              <span className="text-[10px] font-bold">Cart</span>
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                0
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Bestsellers</h1>
          <p className="text-sm text-gray-500">Top picks for your industrial and home needs</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-80 w-full animate-pulse rounded-lg bg-gray-200" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 font-bold">Failed to load products. Is Strapi running?</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 rounded bg-red-600 px-4 py-2 text-white font-bold"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-gray-200 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h4 className="text-sm font-bold text-gray-900 uppercase mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>About Us</li>
                <li>Contact Us</li>
                <li>Careers</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 uppercase mb-4">Policies</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Privacy Policy</li>
                <li>Terms of Use</li>
                <li>Return Policy</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 uppercase mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Help Center</li>
                <li>Track Order</li>
                <li>Cancellation</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 uppercase mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Facebook</li>
                <li>Twitter</li>
                <li>LinkedIn</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-100 pt-8 text-center text-xs text-gray-400">
            © 2026 Moglix Clone. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
