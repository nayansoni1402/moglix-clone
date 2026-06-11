import React from "react";

const Discount = () => {
  return (
    <div className="lg:max-w-[670px] w-full">
      <div className="bg-white rounded-xl border border-gray-3 shadow-sm p-5">
        <h3 className="font-semibold text-dark text-sm mb-3 flex items-center gap-2">
          <span>🏷️</span> Have a Coupon Code?
        </h3>
        <form className="flex gap-3">
          <input
            type="text"
            name="coupon"
            id="coupon"
            placeholder="Enter coupon code"
            className="flex-1 rounded-lg border border-gray-3 bg-[#F4F5F9] placeholder:text-dark-5 py-2.5 px-4 text-sm outline-none transition-all focus:border-blue focus:ring-2 focus:ring-blue/20"
          />
          <button
            type="submit"
            className="font-semibold text-white text-sm bg-blue py-2.5 px-6 rounded-lg transition-all duration-200 hover:bg-blue-dark whitespace-nowrap"
          >
            Apply
          </button>
        </form>
      </div>
    </div>
  );
};

export default Discount;
