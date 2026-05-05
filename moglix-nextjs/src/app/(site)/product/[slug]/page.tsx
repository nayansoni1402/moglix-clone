"use client";
import React, { useState } from "react";
import ProductGallery from "@/components/Product/ProductGallery";
import NewArrival from "@/components/Home/NewArrivals";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const [qty, setQty] = useState(1);
  const [pincode, setPincode] = useState("");

  const productName = slug.replace(/-/g, " ").toUpperCase();

  return (
    <main className="bg-[#F4F5F9] min-h-screen pt-[180px] pb-6">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-8 xl:px-0">

        {/* Breadcrumb */}
        <div className="text-sm text-dark-3 mb-6">
          <span className="hover:text-blue cursor-pointer">Home</span> &gt; <span className="hover:text-blue cursor-pointer">Power Tools</span> &gt; <span className="text-dark font-medium capitalize">{slug.replace(/-/g, " ")}</span>
        </div>

        <div className="bg-white p-6 rounded-md border border-gray-3 shadow-sm flex flex-col lg:flex-row gap-10 mb-8">

          {/* Left Side: Product Gallery */}
          <div className="w-full lg:w-2/5">
            <ProductGallery />
          </div>

          {/* Right Side: Product Info */}
          <div className="w-full lg:w-3/5">
            <h1 className="text-2xl font-bold text-dark mb-2 leading-tight">
              Bosch 500W Professional Hammer Drill Machine, GSB 500 RE Kit
            </h1>

            <div className="flex items-center gap-4 mb-4">
              <span className="text-blue font-medium text-sm hover:underline cursor-pointer">Bosch</span>
              <div className="flex items-center bg-green text-white px-2 py-0.5 rounded text-xs font-semibold">
                4.2 ★
              </div>
              <span className="text-dark-3 text-sm">(124 Reviews)</span>
            </div>

            <div className="border-t border-b border-gray-3 py-4 mb-6">
              <div className="flex items-end gap-3 mb-1">
                <span className="text-3xl font-bold text-dark">₹2,899</span>
                <span className="text-lg text-dark-4 line-through">₹4,200</span>
                <span className="text-green text-lg font-semibold">31% OFF</span>
              </div>
              <p className="text-xs text-dark-3">Inclusive of all taxes</p>
            </div>

            {/* Offers */}
            <div className="mb-6">
              <h3 className="text-dark font-semibold mb-2">Available Offers</h3>
              <ul className="text-custom-sm text-dark-3 space-y-1 pl-4 list-disc">
                <li>Bank Offer: 10% instant discount on HDFC Bank Credit Cards</li>
                <li>Special Price: Get extra 5% off (price inclusive of cashback/coupon)</li>
                <li>EMI starting from ₹140/month.</li>
              </ul>
            </div>

            {/* Pincode Checker */}
            <div className="mb-6 max-w-sm">
              <h3 className="text-dark font-semibold mb-2 text-sm">Check Delivery</h3>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Enter Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="border border-gray-3 rounded-l-md px-3 py-2 outline-none focus:border-blue flex-grow text-sm"
                />
                <button className="bg-dark text-white px-4 py-2 rounded-r-md text-sm font-medium hover:bg-dark-2 transition">
                  Check
                </button>
              </div>
              <p className="text-xs text-green mt-2">Delivery by Tomorrow, 24th Oct</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-3 rounded-md">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 h-10 flex items-center justify-center text-dark hover:bg-gray-2 transition"
                >-</button>
                <input
                  type="text"
                  value={qty}
                  readOnly
                  className="w-12 h-10 text-center border-x border-gray-3 text-dark font-medium outline-none"
                />
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-10 h-10 flex items-center justify-center text-dark hover:bg-gray-2 transition"
                >+</button>
              </div>

              <button className="flex-grow bg-red text-white py-3 rounded-md font-bold text-lg hover:bg-red-dark transition shadow-md">
                ADD TO CART
              </button>
              <button className="flex-grow bg-dark text-white py-3 rounded-md font-bold text-lg hover:bg-dark-2 transition shadow-md">
                BUY NOW
              </button>
            </div>

            {/* RFQ */}
            <div className="bg-blue-light-5 border border-blue-light text-blue-dark px-4 py-3 rounded-md text-sm flex items-center justify-between">
              <div>
                <span className="font-semibold block mb-1">Buying for your business?</span>
                <span>Get GST invoice and bulk discounts.</span>
              </div>
              <button className="bg-white text-blue border border-blue px-4 py-1.5 rounded text-xs font-semibold hover:bg-blue hover:text-white transition">
                Request Quote
              </button>
            </div>

          </div>
        </div>

        {/* Specs and Description */}
        <div className="bg-white rounded-md border border-gray-3 shadow-sm mb-8 overflow-hidden">
          <div className="flex border-b border-gray-3 bg-gray-1">
            <button className="px-6 py-3 font-semibold text-blue border-b-2 border-blue bg-white">Description</button>
            <button className="px-6 py-3 font-medium text-dark-3 hover:text-blue transition">Specifications</button>
            <button className="px-6 py-3 font-medium text-dark-3 hover:text-blue transition">Reviews</button>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-dark mb-4">Product Description</h3>
            <p className="text-dark-3 text-sm mb-4 leading-relaxed">
              The Bosch GSB 500 RE Professional Hammer Drill machine is a powerful and versatile tool for all your drilling needs...
              (This is a detailed placeholder description explaining the features of the product in a paragraph format.)
            </p>

            <h3 className="text-lg font-bold text-dark mb-4 mt-8">Key Features</h3>
            <ul className="list-disc pl-5 space-y-2 text-dark-3 text-sm">
              <li>Robust and powerful 500W motor</li>
              <li>Extremely compact for working in tight spaces</li>
              <li>Forward/reverse rotation</li>
              <li>Electronic control for exact pilot drilling</li>
            </ul>

            <h3 className="text-lg font-bold text-dark mb-4 mt-8">Specifications</h3>
            <div className="w-full max-w-2xl border border-gray-3 rounded-md text-sm">
              <div className="flex border-b border-gray-3 bg-gray-1">
                <div className="w-1/2 p-3 font-semibold text-dark border-r border-gray-3">Brand</div>
                <div className="w-1/2 p-3 text-dark-3">Bosch</div>
              </div>
              <div className="flex border-b border-gray-3">
                <div className="w-1/2 p-3 font-semibold text-dark border-r border-gray-3">Power Input</div>
                <div className="w-1/2 p-3 text-dark-3">500 W</div>
              </div>
              <div className="flex border-b border-gray-3 bg-gray-1">
                <div className="w-1/2 p-3 font-semibold text-dark border-r border-gray-3">No-load Speed</div>
                <div className="w-1/2 p-3 text-dark-3">0 - 2600 rpm</div>
              </div>
              <div className="flex">
                <div className="w-1/2 p-3 font-semibold text-dark border-r border-gray-3">Weight</div>
                <div className="w-1/2 p-3 text-dark-3">1.5 kg</div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <NewArrival title="Customers Also Bought" viewAllLink="/category/similar" />

      </div>
    </main>
  );
}

