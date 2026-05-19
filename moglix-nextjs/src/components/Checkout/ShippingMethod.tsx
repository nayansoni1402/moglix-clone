import React, { useState } from "react";
import Image from "next/image";

const ShippingMethod = () => {
  const [shippingMethod, setShippingMethod] = useState("free");

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor="free" className="flex cursor-pointer select-none items-center gap-3 p-3 rounded-lg border border-gray-3 hover:border-blue hover:bg-blue/5 transition-all">
        <div
          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-all ${
            shippingMethod === "free" ? "border-4 border-blue" : "border border-gray-4"
          }`}
        />
        <input type="radio" name="shipping" id="free" className="sr-only" onChange={() => setShippingMethod("free")} />
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-medium text-dark">🚚 Free Shipping</span>
          <span className="text-green-600 text-sm font-bold">FREE</span>
        </div>
      </label>

      <label htmlFor="fedex" className="flex cursor-pointer select-none items-center gap-3 p-3 rounded-lg border border-gray-3 hover:border-blue hover:bg-blue/5 transition-all">
        <div
          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-all ${
            shippingMethod === "fedex" ? "border-4 border-blue" : "border border-gray-4"
          }`}
        />
        <input type="radio" name="shipping" id="fedex" className="sr-only" onChange={() => setShippingMethod("fedex")} />
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Image src="/images/checkout/fedex.svg" alt="fedex" width={55} height={16} />
            <span className="text-xs text-dark-4">Standard Shipping (3-5 days)</span>
          </div>
          <span className="text-sm font-bold text-dark">$8.99</span>
        </div>
      </label>

      <label htmlFor="dhl" className="flex cursor-pointer select-none items-center gap-3 p-3 rounded-lg border border-gray-3 hover:border-blue hover:bg-blue/5 transition-all">
        <div
          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-all ${
            shippingMethod === "dhl" ? "border-4 border-blue" : "border border-gray-4"
          }`}
        />
        <input type="radio" name="shipping" id="dhl" className="sr-only" onChange={() => setShippingMethod("dhl")} />
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Image src="/images/checkout/dhl.svg" alt="dhl" width={55} height={18} />
            <span className="text-xs text-dark-4">Express Delivery (1-2 days)</span>
          </div>
          <span className="text-sm font-bold text-dark">$14.99</span>
        </div>
      </label>
    </div>
  );
};

export default ShippingMethod;
