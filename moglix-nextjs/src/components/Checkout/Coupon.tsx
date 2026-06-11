import React from "react";

const Coupon = () => {
  return (
    <div>
      <h3 className="font-semibold text-dark text-sm mb-3 flex items-center gap-2">
        <span>🏷️</span> Have a Coupon Code?
      </h3>
      <div className="flex gap-2">
        <input
          type="text"
          name="coupon"
          id="coupon"
          placeholder="Enter coupon code"
          className="flex-1 rounded-lg border border-gray-3 bg-[#F4F5F9] placeholder:text-dark-5 py-2.5 px-4 text-sm outline-none transition-all focus:border-blue focus:ring-2 focus:ring-blue/20"
        />
        <button
          type="button"
          className="font-semibold text-white text-sm bg-blue py-2.5 px-5 rounded-lg transition-all hover:bg-blue-dark whitespace-nowrap"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default Coupon;
