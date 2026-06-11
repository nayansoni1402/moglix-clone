import React, { useState } from "react";
import Image from "next/image";

const PaymentMethod = () => {
  const [payment, setPayment] = useState("upi");

  return (
    <div className="flex flex-col gap-3">
      {/* UPI */}
      <label htmlFor="upi" className={`flex cursor-pointer select-none items-center gap-3 p-3 rounded-lg border transition-all ${payment === "upi" ? "border-blue bg-blue/5" : "border-gray-3 hover:border-blue hover:bg-blue/5"}`}>
        <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-all ${payment === "upi" ? "border-4 border-blue" : "border border-gray-4"}`} />
        <input type="radio" name="payment" id="upi" className="sr-only" onChange={() => setPayment("upi")} />
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-medium text-dark flex items-center gap-2">
            <span className="text-base">📱</span> UPI (Google Pay, PhonePe, Paytm)
          </span>
        </div>
      </label>

      {/* Bank Transfer */}
      <label htmlFor="bank" className={`flex cursor-pointer select-none items-center gap-3 p-3 rounded-lg border transition-all ${payment === "bank" ? "border-blue bg-blue/5" : "border-gray-3 hover:border-blue hover:bg-blue/5"}`}>
        <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-all ${payment === "bank" ? "border-4 border-blue" : "border border-gray-4"}`} />
        <input type="radio" name="payment" id="bank" className="sr-only" onChange={() => setPayment("bank")} />
        <div className="flex items-center gap-3 w-full">
          <Image src="/images/checkout/bank.svg" alt="bank" width={26} height={12} />
          <span className="text-sm font-medium text-dark">Net Banking / Direct Transfer</span>
        </div>
      </label>

      {/* Cash on Delivery */}
      <label htmlFor="cash" className={`flex cursor-pointer select-none items-center gap-3 p-3 rounded-lg border transition-all ${payment === "cash" ? "border-blue bg-blue/5" : "border-gray-3 hover:border-blue hover:bg-blue/5"}`}>
        <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-all ${payment === "cash" ? "border-4 border-blue" : "border border-gray-4"}`} />
        <input type="radio" name="payment" id="cash" className="sr-only" onChange={() => setPayment("cash")} />
        <div className="flex items-center gap-3 w-full">
          <Image src="/images/checkout/cash.svg" alt="cash" width={20} height={20} />
          <div>
            <span className="text-sm font-medium text-dark">Cash on Delivery</span>
            <p className="text-xs text-dark-4">Pay when your order arrives</p>
          </div>
        </div>
      </label>

      {/* PayPal */}
      <label htmlFor="paypal" className={`flex cursor-pointer select-none items-center gap-3 p-3 rounded-lg border transition-all ${payment === "paypal" ? "border-blue bg-blue/5" : "border-gray-3 hover:border-blue hover:bg-blue/5"}`}>
        <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-all ${payment === "paypal" ? "border-4 border-blue" : "border border-gray-4"}`} />
        <input type="radio" name="payment" id="paypal" className="sr-only" onChange={() => setPayment("paypal")} />
        <div className="flex items-center gap-3 w-full">
          <Image src="/images/checkout/paypal.svg" alt="paypal" width={65} height={18} />
        </div>
      </label>
    </div>
  );
};

export default PaymentMethod;
