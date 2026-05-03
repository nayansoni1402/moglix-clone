import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Star } from 'lucide-react';
import parse from 'html-react-parser';
import sanitizeHtml from 'sanitize-html';

import { getProductBySlug } from '@/services/product.service';
import { stripHtml, formatCurrency } from '@/lib/helpers';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  const seo = product.seo;
  const plainDescription = stripHtml(product.description).substring(0, 160);

  return {
    title: seo?.metaTitle || product.name,
    description: seo?.metaDescription || plainDescription,
    keywords: seo?.keywords,
  };
}

export default async function ProductPage({ params }: Props) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  // Generate JSON-LD schema
  const productSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: stripHtml(product.description),
    sku: product.id?.toString(),
    offers: {
      '@type': 'Offer',
      url: `https://www.moglix.com/products/${product.slug}`,
      priceCurrency: 'INR',
      price: product.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
    },
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount,
      },
    }),
    ...(product.brand && {
      brand: {
        '@type': 'Brand',
        name: product.brand.name,
      },
    }),
  };

  const primaryCategory = product.categories?.[0];

  const breadcrumbItems = [
    ...(primaryCategory?.parent ? [{ label: primaryCategory.parent.name, href: '#' }] : []),
    ...(primaryCategory ? [{ label: primaryCategory.name, href: '#' }] : []),
    { label: product.name },
  ];

  const sanitizeOptions = {
    allowedTags: [ 'b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'li', 'ol', 'br' ],
    allowedAttributes: {
      'a': [ 'href' ]
    }
  };

  return (
    <>
      <JsonLd schema={productSchema} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <Breadcrumbs items={breadcrumbItems} />

        <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-1/2 p-8 flex items-center justify-center border-r border-gray-100 relative">
             <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
               <span className="text-lg">Product Image</span>
             </div>
             {product.discount > 0 && (
               <div className="absolute top-4 left-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                 {product.discount}% OFF
               </div>
             )}
          </div>

          {/* Product Details Section */}
          <div className="md:w-1/2 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            
            {product.rating && (
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center bg-green-600 text-white px-2 py-0.5 rounded text-sm font-semibold">
                  <span>{product.rating}</span>
                  <Star className="w-3 h-3 ml-1 fill-current" />
                </div>
                <span className="text-blue-600 text-sm hover:underline cursor-pointer">
                  ({product.reviewCount} Reviews)
                </span>
              </div>
            )}

            <div className="mb-6">
              <div className="flex items-end space-x-3">
                <span className="text-3xl font-bold text-gray-900">{formatCurrency(product.price)}</span>
                <span className="text-sm text-gray-500 mb-1">(Incl. of all taxes)</span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-gray-500 line-through">MRP {formatCurrency(product.mrp)}</span>
                {product.discount > 0 && (
                  <span className="text-green-600 font-semibold">{product.discount}% OFF</span>
                )}
              </div>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Available Packs</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant: any) => (
                    <Link
                      key={variant.id}
                      href={`/products/${variant.url}`}
                      className={`border px-4 py-2 rounded-md text-sm cursor-pointer transition-colors ${
                        variant.url === resolvedParams.slug 
                          ? 'border-red-600 text-red-600 bg-red-50 font-semibold' 
                          : 'border-gray-300 text-gray-700 hover:border-red-600 hover:text-red-600'
                      }`}
                    >
                      {variant.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4 mb-8">
              <button className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-sm">
                ADD TO CART
              </button>
              <button className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors shadow-sm">
                BUY NOW
              </button>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Key Features */}
            {product.features && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Key Features</h2>
                <div className="prose prose-sm text-gray-600 max-w-none marker:text-gray-400">
                  {parse(sanitizeHtml(product.features, sanitizeOptions))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Product Description */}
        {product.description && (
          <div className="mt-8 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Product Details</h2>
            <div className="prose text-gray-600 max-w-none">
              {parse(sanitizeHtml(product.description, sanitizeOptions))}
            </div>
          </div>
        )}

      </div>
    </>
  );
}
