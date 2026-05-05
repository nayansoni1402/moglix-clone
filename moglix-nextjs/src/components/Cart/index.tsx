"use client";
import React from "react";
import Discount from "./Discount";
import OrderSummary from "./OrderSummary";
import { useAppSelector } from "@/redux/store";
import SingleItem from "./SingleItem";
import Breadcrumb from "../Common/Breadcrumb";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { removeAllItemsFromCart } from "@/redux/features/cart-slice";

const Cart = () => {
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
      <Breadcrumb title={"Cart"} pages={["cart"]} />

      {cartItems.length > 0 ? (
        <section className="overflow-hidden pt-4 pb-16 bg-[#F4F5F9]">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">

            {/* Page Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="font-bold text-dark text-xl">
                  Shopping Cart
                  <span className="ml-2 text-sm font-normal text-dark-4 bg-white border border-gray-3 px-2 py-0.5 rounded-full">
                    {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
                  </span>
                </h2>
              </div>
              <button
                onClick={() => dispatch(removeAllItemsFromCart())}
                className="text-sm text-red hover:underline font-medium flex items-center gap-1"
              >
                🗑 Clear Cart
              </button>
            </div>

            {/* Cart Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-3 overflow-hidden">
              {/* Table Header */}
              <div className="hidden md:flex items-center py-3 px-6 bg-[#F4F5F9] border-b border-gray-3">
                <div className="flex-1 min-w-[300px]">
                  <p className="text-xs font-bold text-dark-4 uppercase tracking-wider">Product</p>
                </div>
                <div className="w-[140px] text-center">
                  <p className="text-xs font-bold text-dark-4 uppercase tracking-wider">Price</p>
                </div>
                <div className="w-[160px] text-center">
                  <p className="text-xs font-bold text-dark-4 uppercase tracking-wider">Quantity</p>
                </div>
                <div className="w-[140px] text-center">
                  <p className="text-xs font-bold text-dark-4 uppercase tracking-wider">Subtotal</p>
                </div>
                <div className="w-[60px]" />
              </div>

              {/* Cart Items */}
              <div className="divide-y divide-gray-3">
                {cartItems.map((item, key) => (
                  <SingleItem item={item} key={key} />
                ))}
              </div>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col lg:flex-row gap-6 mt-6">
              <Discount />
              <OrderSummary />
            </div>
          </div>
        </section>
      ) : (
        <section className="pt-4 pb-20 bg-[#F4F5F9]">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="bg-white rounded-xl border border-gray-3 shadow-sm px-6 py-16 text-center">
              {/* Empty Cart Icon */}
              <div className="w-24 h-24 rounded-full bg-[#F4F5F9] flex items-center justify-center mx-auto mb-6">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#8D93A5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="3" y1="6" x2="21" y2="6" stroke="#8D93A5" strokeWidth="1.5"/>
                  <path d="M16 10a4 4 0 01-8 0" stroke="#8D93A5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="font-bold text-dark text-xl mb-2">Your cart is empty</h3>
              <p className="text-dark-4 text-sm mb-8 max-w-xs mx-auto">
                Looks like you haven't added anything yet. Browse our wide range of industrial products!
              </p>
              <Link
                href="/category/power-tools"
                className="inline-flex items-center gap-2 font-bold text-white bg-blue py-3 px-8 rounded-lg transition-all duration-200 hover:bg-blue-dark shadow-sm"
              >
                Start Shopping →
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Cart;
