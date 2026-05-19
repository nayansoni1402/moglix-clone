import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useAppSelector } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { ChevronRight, Sparkles, Lock, Truck, RotateCcw } from "lucide-react";


const OrderSummary = () => {
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);
  const shipping = totalPrice > 99 ? 0 : 9.99;
  const grandTotal = totalPrice + shipping;

  return (
    <div className="lg:max-w-[455px] w-full">
      <div className="bg-white rounded-xl border border-gray-3 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-blue px-5 py-4">
          <h3 className="font-bold text-white text-base">Order Summary</h3>
        </div>

        <div className="p-5">
          {/* Item List */}
          <div className="space-y-2 mb-4 max-h-[200px] overflow-y-auto">
            {cartItems.map((item, key) => (
              <div key={key} className="flex items-center justify-between text-sm">
                <p className="text-dark-4 truncate max-w-[220px]">
                  {item.title}
                  <span className="text-dark-5 ml-1">×{item.quantity}</span>
                </p>
                <p className="text-dark font-medium whitespace-nowrap">
                  ${(item.discountedPrice * item.quantity).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-3 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-dark-4">
              <span>Subtotal</span>
              <span className="font-medium text-dark">${totalPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-sm text-dark-4">
              <span>Shipping</span>
              <span className={`font-medium flex items-center gap-1 ${shipping === 0 ? "text-green-600" : "text-dark"}`}>
                {shipping === 0 ? <><Sparkles size={14} /> FREE</> : `$${shipping.toFixed(2)}`}
              </span>

            </div>
            <div className="flex justify-between text-sm text-dark-4">
              <span>Taxes (18% GST)</span>
              <span className="font-medium text-dark">
                ${(totalPrice * 0.18).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center border-t border-gray-3 pt-4 mt-4">
            <p className="font-bold text-dark text-base">Total</p>
            <p className="font-bold text-blue text-xl">
              ${(grandTotal + totalPrice * 0.18).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          {/* Checkout Button */}
          <Link
            href="/checkout"
            className="w-full flex justify-center items-center gap-2 font-bold text-white bg-blue py-3 px-6 rounded-lg transition-all duration-200 hover:bg-blue-dark mt-5 shadow-sm uppercase tracking-wider"
          >
            Proceed to Checkout <ChevronRight size={18} />
          </Link>


          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-3">
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-dark-4"><Lock size={12} className="text-green-600" /> Secure</span>
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-dark-4"><Truck size={12} className="text-blue" /> Fast Delivery</span>
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-dark-4"><RotateCcw size={12} className="text-orange-500" /> Easy Returns</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
