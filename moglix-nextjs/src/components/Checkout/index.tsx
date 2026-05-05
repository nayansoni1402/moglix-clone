"use client";
import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Billing from "./Billing";
import ShippingMethod from "./ShippingMethod";
import PaymentMethod from "./PaymentMethod";
import Coupon from "./Coupon";
import { useAppSelector } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectTotalPrice } from "@/redux/features/cart-slice";

const Checkout = () => {
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);
  const shipping = totalPrice > 999 ? 0 : 99;
  const gst = Math.round(totalPrice * 0.18);
  const grandTotal = totalPrice + shipping + gst;

  return (
    <>
      <Breadcrumb title={"Checkout"} pages={["checkout"]} />
      <section className="pt-4 pb-16 bg-[#F4F5F9]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">

          {/* Steps Indicator */}
          <div className="flex items-center gap-2 mb-6 text-sm">
            <span className="flex items-center gap-1.5 text-dark-4">
              <span className="w-5 h-5 rounded-full bg-blue text-white text-xs flex items-center justify-center font-bold">✓</span>
              Cart
            </span>
            <span className="text-gray-3">——</span>
            <span className="flex items-center gap-1.5 text-blue font-semibold">
              <span className="w-5 h-5 rounded-full bg-blue text-white text-xs flex items-center justify-center font-bold">2</span>
              Checkout
            </span>
            <span className="text-gray-3">——</span>
            <span className="flex items-center gap-1.5 text-dark-4">
              <span className="w-5 h-5 rounded-full bg-gray-3 text-dark-5 text-xs flex items-center justify-center font-bold">3</span>
              Order Placed
            </span>
          </div>

          <form>
            <div className="flex flex-col lg:flex-row gap-6">

              {/* Left Column - Billing & Shipping */}
              <div className="lg:flex-1">

                {/* Billing Details */}
                <div className="bg-white rounded-xl border border-gray-3 shadow-sm overflow-hidden mb-5">
                  <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-3 bg-[#F4F5F9]">
                    <span className="w-6 h-6 rounded-full bg-blue text-white text-xs flex items-center justify-center font-bold">1</span>
                    <h3 className="font-bold text-dark text-sm">Billing Details</h3>
                  </div>
                  <div className="p-5">
                    <Billing />
                  </div>
                </div>

                {/* Shipping Method */}
                <div className="bg-white rounded-xl border border-gray-3 shadow-sm overflow-hidden mb-5">
                  <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-3 bg-[#F4F5F9]">
                    <span className="w-6 h-6 rounded-full bg-blue text-white text-xs flex items-center justify-center font-bold">2</span>
                    <h3 className="font-bold text-dark text-sm">Shipping Method</h3>
                  </div>
                  <div className="p-5">
                    <ShippingMethod />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-xl border border-gray-3 shadow-sm overflow-hidden mb-5">
                  <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-3 bg-[#F4F5F9]">
                    <span className="w-6 h-6 rounded-full bg-blue text-white text-xs flex items-center justify-center font-bold">3</span>
                    <h3 className="font-bold text-dark text-sm">Payment Method</h3>
                  </div>
                  <div className="p-5">
                    <PaymentMethod />
                  </div>
                </div>

                {/* Order Notes */}
                <div className="bg-white rounded-xl border border-gray-3 shadow-sm overflow-hidden">
                  <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-3 bg-[#F4F5F9]">
                    <span className="text-base">📝</span>
                    <h3 className="font-bold text-dark text-sm">Order Notes (Optional)</h3>
                  </div>
                  <div className="p-5">
                    <textarea
                      name="notes"
                      id="notes"
                      rows={3}
                      placeholder="Special instructions for delivery, e.g. leave at gate..."
                      className="rounded-lg border border-gray-3 bg-[#F4F5F9] placeholder:text-dark-5 w-full p-4 text-sm outline-none transition-all focus:border-blue focus:ring-2 focus:ring-blue/20"
                    />
                  </div>
                </div>

              </div>

              {/* Right Column - sticky: Coupon + Order Summary */}
              <div className="lg:w-[380px] shrink-0">
                <div className="sticky top-[170px]">

                  {/* Coupon */}
                  <div className="bg-white rounded-xl border border-gray-3 shadow-sm overflow-hidden mb-4">
                    <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-3 bg-[#F4F5F9]">
                      <span className="text-base">🏷️</span>
                      <h3 className="font-bold text-dark text-sm">Have a Coupon Code?</h3>
                    </div>
                    <div className="px-5 pt-3 pb-5 flex gap-2">
                      <input
                        type="text"
                        name="coupon"
                        id="coupon"
                        placeholder="Enter coupon code"
                        className="flex-1 rounded-lg border border-gray-3 bg-[#F4F5F9] placeholder:text-dark-5 py-2.5 px-4 text-sm outline-none transition-all focus:border-blue focus:ring-2 focus:ring-blue/20"
                      />
                      <button type="button" className="font-semibold text-white text-sm bg-blue py-2.5 px-5 rounded-lg transition-all hover:bg-blue-dark whitespace-nowrap">
                        Apply
                      </button>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-white rounded-xl border border-gray-3 shadow-sm overflow-hidden">
                    <div className="bg-blue px-5 py-3">
                      <h3 className="font-bold text-white text-sm">Your Order</h3>
                    </div>

                    <div className="p-5">
                      {/* Items */}
                      <div className="space-y-2.5 mb-4 max-h-[200px] overflow-y-auto">
                        {cartItems.length > 0 ? (
                          cartItems.map((item, key) => (
                            <div key={key} className="flex justify-between text-sm">
                              <p className="text-dark-4 truncate max-w-[200px]">
                                {item.title}
                                <span className="text-dark-5 ml-1">×{item.quantity}</span>
                              </p>
                              <p className="font-medium text-dark whitespace-nowrap">
                                ₹{(item.discountedPrice * item.quantity).toLocaleString("en-IN")}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-dark-4 italic">No items in cart</p>
                        )}
                      </div>

                      {/* Price Breakdown */}
                      <div className="border-t border-gray-3 pt-4 space-y-2">
                        <div className="flex justify-between text-sm text-dark-4">
                          <span>Subtotal</span>
                          <span className="font-medium text-dark">₹{totalPrice.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between text-sm text-dark-4">
                          <span>Shipping</span>
                          <span className={`font-medium ${shipping === 0 ? "text-green-600" : "text-dark"}`}>
                            {shipping === 0 ? "🎉 FREE" : `₹${shipping}`}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-dark-4">
                          <span>GST (18%)</span>
                          <span className="font-medium text-dark">₹{gst.toLocaleString("en-IN")}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center border-t border-gray-3 pt-4 mt-4">
                        <p className="font-bold text-dark">Total</p>
                        <p className="font-bold text-blue text-xl">₹{grandTotal.toLocaleString("en-IN")}</p>
                      </div>

                      {/* Place Order Button */}
                      <button
                        type="submit"
                        className="w-full flex justify-center items-center gap-2 font-bold text-white bg-blue py-3 px-6 rounded-lg transition-all duration-200 hover:bg-blue-dark mt-5 shadow-sm text-sm"
                      >
                        🔒 Place Order Securely
                      </button>

                      {/* Trust */}
                      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-3">
                        <span className="text-xs text-dark-4">🔒 SSL Secure</span>
                        <span className="text-xs text-dark-4">🚚 Fast Delivery</span>
                        <span className="text-xs text-dark-4">↩️ Easy Returns</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;
