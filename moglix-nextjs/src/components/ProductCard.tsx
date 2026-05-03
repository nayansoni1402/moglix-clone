import Image from 'next/image';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { getImageUrl } from '@/lib/strapi';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.mainImageUrl || (product.images?.[0]?.url ? getImageUrl(product.images[0].url) : '/placeholder.jpg');

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
      <a href={product.url} target="_blank" rel="noopener noreferrer" className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-contain transition-transform group-hover:scale-105"
        />
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
            {product.discount}% OFF
          </div>
        )}
      </a>
      
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
          {product.brand?.name || 'Moglix'}
        </div>
        <a href={product.url} target="_blank" rel="noopener noreferrer">
          <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-red-600">
            {product.name}
          </h3>
        </a>
        
        <div className="mt-auto">
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center rounded bg-green-100 px-1.5 py-0.5 text-xs font-bold text-green-700">
              {product.rating || '4.5'}
              <Star className="ml-1 h-3 w-3 fill-current" />
            </div>
            <span className="text-xs text-gray-500">({product.reviewCount || '0'})</span>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
            {product.mrp > product.price && (
              <span className="text-xs text-gray-400 line-through">₹{product.mrp.toLocaleString()}</span>
            )}
          </div>
        </div>
        
        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-red-600 px-4 py-2 text-sm font-bold text-red-600 transition-colors hover:bg-red-600 hover:text-white">
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
