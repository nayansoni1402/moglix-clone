import Link from 'next/link';
import { Search, ShoppingCart, User } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-extrabold text-red-600 tracking-tight">
              moglix
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8 hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm transition duration-150 ease-in-out"
                placeholder="Search products, brands and more..."
              />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-6">
            <Link href="/account" className="text-gray-500 hover:text-red-600 flex flex-col items-center group">
              <User className="h-6 w-6 group-hover:fill-red-50" />
              <span className="text-xs font-medium mt-1">Login</span>
            </Link>
            <Link href="/cart" className="text-gray-500 hover:text-red-600 flex flex-col items-center group relative">
              <ShoppingCart className="h-6 w-6 group-hover:fill-red-50" />
              <span className="text-xs font-medium mt-1">Cart</span>
              <span className="absolute top-0 right-0 -mt-1 -mr-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                0
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
