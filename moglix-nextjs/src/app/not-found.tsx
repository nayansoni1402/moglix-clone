import Link from 'next/link';
import { Home, Search, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center bg-white p-10 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
        </div>
        
        <div>
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
            Oops! Page Not Found
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <Link 
            href="/"
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home Page
          </Link>
          
          <button 
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <Search className="w-4 h-4 mr-2" />
            Search Products
          </button>
        </div>
      </div>
      
      <div className="mt-8 text-sm text-gray-500 text-center">
        Need help? <Link href="/contact" className="text-red-600 hover:text-red-500">Contact our support team</Link>
      </div>
    </div>
  );
}
