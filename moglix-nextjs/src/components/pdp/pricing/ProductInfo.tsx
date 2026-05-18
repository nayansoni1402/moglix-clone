import Link from "next/link";
import { Star, Shield, Package, RefreshCw, Tag } from "lucide-react";
import type { ProductGroup, ProductTag } from "@/types/product";
import { formatPrice, calculateDiscount } from "@/lib/utils/product";

interface ProductInfoProps {
  product: ProductGroup;
  msn: string;
  tags: ProductTag[];
}

function StarRating({ rating, count }: { rating: number; count?: number }) {
  const stars = Math.round(rating);
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex items-center gap-1 text-white text-xs font-bold px-2 py-0.5 rounded ${
          rating >= 4 ? "bg-green" : rating >= 3 ? "bg-yellow" : "bg-red"
        }`}
      >
        <span>{rating.toFixed(1)}</span>
        <Star size={10} fill="white" />
      </div>
      {count !== undefined && (
        <span className="text-xs text-gray-5 font-medium">{count} Ratings</span>
      )}
    </div>
  );
}

export default function ProductInfo({ product, msn, tags }: ProductInfoProps) {
  const { priceQuantityCountry: price } = product;
  const discountPct = calculateDiscount(price.mrp, price.sellingPrice);

  return (
    <div className="space-y-4">
      {/* Tags */}
      {tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag.tagId}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-orange bg-orange/10 border border-orange/20 px-2.5 py-1 rounded-full"
            >
              <Tag size={11} />
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Brand */}
      <div>
        <Link
          href={`/brand/${product.productBrandDetails.friendlyUrl}`}
          className="text-blue text-sm font-bold hover:underline uppercase tracking-wide"
        >
          {product.productBrandDetails.brandName}
        </Link>
      </div>

      {/* Product Name */}
      <h1 className="text-lg sm:text-xl font-bold text-body leading-snug">
        {product.productName}
      </h1>

      {/* Rating */}
      {product.productRating && Number(product.productRating) > 0 && (
        <StarRating rating={Number(product.productRating)} />
      )}

      {/* MSN */}
      <div className="text-xs text-gray-5">
        <span className="font-medium">MSN: </span>
        <span className="font-mono">{msn.toUpperCase()}</span>
      </div>

      {/* Price Block */}
      <div className="bg-[#F8F9FB] rounded-xl p-4 border border-gray-1">
        <div className="flex items-end flex-wrap gap-2 mb-1">
          <span className="text-3xl font-black text-body">
            {formatPrice(price.sellingPrice)}
          </span>
          {price.mrp > price.sellingPrice && (
            <span className="text-base text-gray-5 line-through font-medium">
              {formatPrice(price.mrp)}
            </span>
          )}
          {discountPct > 0 && (
            <span className="bg-blue/10 text-blue text-sm font-bold px-2 py-0.5 rounded">
              {discountPct}% OFF
            </span>
          )}
        </div>
        <p className="text-xs text-gray-5 font-medium">
          Inclusive of {price.taxRule?.taxPercentage}% GST
        </p>
        {price.offeredPriceWithTax && price.offeredPriceWithTax !== price.sellingPrice && (
          <p className="text-xs text-green font-semibold mt-1">
            MRP: {formatPrice(price.offeredPriceWithTax)} (with GST)
          </p>
        )}
      </div>

      {/* EMI */}
      <div className="flex items-center gap-2 text-xs text-dark-3 border border-gray-1 rounded-lg px-3 py-2 bg-white">
        <span className="text-blue font-bold">EMI</span>
        <span>No Cost EMI available · Starting from ₹{Math.round(price.sellingPrice / 12).toLocaleString("en-IN")}/month</span>
      </div>

      {/* Key Features */}
      {product.productKeyFeatures?.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-body mb-2 uppercase tracking-wide">Key Features</h3>
          <ul className="space-y-1.5">
            {product.productKeyFeatures.map((feat, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-dark-3">
                <span className="w-1.5 h-1.5 rounded-full bg-blue mt-2 shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Product Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {price.estimatedDelivery && (
          <div className="flex items-center gap-2 text-xs text-dark-3 bg-white border border-gray-1 rounded-lg p-3">
            <Package size={16} className="text-blue shrink-0" />
            <div>
              <p className="text-[10px] text-gray-5 uppercase font-bold">Delivery</p>
              <p className="font-semibold">{price.estimatedDelivery}</p>
            </div>
          </div>
        )}
        {product.returnable && (
          <div className="flex items-center gap-2 text-xs text-dark-3 bg-white border border-gray-1 rounded-lg p-3">
            <RefreshCw size={16} className="text-green shrink-0" />
            <div>
              <p className="text-[10px] text-gray-5 uppercase font-bold">Returns</p>
              <p className="font-semibold">{product.returnDuration} Day Returns</p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-dark-3 bg-white border border-gray-1 rounded-lg p-3">
          <Shield size={16} className="text-orange shrink-0" />
          <div>
            <p className="text-[10px] text-gray-5 uppercase font-bold">Warranty</p>
            <p className="font-semibold">Manufacturer Warranty</p>
          </div>
        </div>
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        {price.outOfStockFlag ? (
          <span className="inline-flex items-center gap-1 text-red text-sm font-bold">
            <span className="w-2 h-2 rounded-full bg-red" />
            Out of Stock
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-green text-sm font-bold">
            <span className="w-2 h-2 rounded-full bg-green" />
            In Stock ({price.quantityAvailable} units available)
          </span>
        )}
      </div>
    </div>
  );
}
