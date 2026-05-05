"use client";
import React, { useEffect } from "react";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import { removeItemFromCart, selectTotalPrice } from "@/redux/features/cart-slice";
import { useAppSelector } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import SingleItem from "./SingleItem";
import Link from "next/link";
import EmptyCart from "./EmptyCart";

const CartSidebarModal = () => {
  const { isCartModalOpen, closeCartModal } = useCartModalContext();
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target.closest(".modal-content")) {
        closeCartModal();
      }
    }
    if (isCartModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartModalOpen, closeCartModal]);

  const shipping = totalPrice > 999 ? 0 : 99;
  const grandTotal = totalPrice + shipping;

  return (
    <div
      className={`fixed top-0 left-0 z-99999 w-full h-screen bg-dark/60 ease-in-out duration-300 ${
        isCartModalOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Sidebar Panel */}
      <div
        className={`modal-content absolute top-0 right-0 h-full w-full max-w-[420px] bg-white shadow-2xl flex flex-col ease-in-out duration-300 ${
          isCartModalOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-3 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="3" y1="6" x2="21" y2="6" stroke="white" strokeWidth="2"/>
                <path d="M16 10a4 4 0 01-8 0" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-dark text-base">Shopping Cart</h2>
              <p className="text-xs text-dark-4">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <button
            onClick={closeCartModal}
            className="w-8 h-8 rounded-full bg-gray-2 flex items-center justify-center hover:bg-red-light-6 hover:text-red transition-all duration-200"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Free Shipping Banner */}
        {totalPrice > 0 && totalPrice < 999 && (
          <div className="mx-4 mt-3 px-4 py-2 bg-blue/10 border border-blue/30 rounded-lg">
            <p className="text-xs text-blue font-medium text-center">
              🎉 Add ₹{999 - totalPrice} more for <strong>FREE Shipping!</strong>
            </p>
            <div className="mt-1.5 bg-gray-3 rounded-full h-1.5">
              <div
                className="bg-blue h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((totalPrice / 999) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
        {totalPrice >= 999 && (
          <div className="mx-4 mt-3 px-4 py-2 bg-green-50 border border-green-300 rounded-lg">
            <p className="text-xs text-green-700 font-medium text-center">✅ You got FREE Shipping!</p>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4">
          <div className="flex flex-col gap-3">
            {cartItems.length > 0 ? (
              cartItems.map((item, key) => (
                <SingleItem
                  key={key}
                  item={item}
                  removeItemFromCart={removeItemFromCart}
                />
              ))
            ) : (
              <EmptyCart />
            )}
          </div>
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-3 bg-white px-4 pt-4 pb-5">
            {/* Price Breakdown */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-dark-4">
                <span>Subtotal ({cartItems.length} items)</span>
                <span className="font-medium text-dark">₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm text-dark-4">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-green-600 font-medium" : "font-medium text-dark"}>
                  {shipping === 0 ? "FREE" : `₹${shipping}`}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-3">
                <span className="font-bold text-dark">Total</span>
                <span className="font-bold text-blue text-lg">₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <Link
                onClick={closeCartModal}
                href="/cart"
                className="flex-1 flex justify-center items-center font-semibold text-blue border-2 border-blue py-2.5 px-4 rounded-lg transition-all duration-200 hover:bg-blue hover:text-white text-sm"
              >
                View Cart
              </Link>
              <Link
                onClick={closeCartModal}
                href="/checkout"
                className="flex-1 flex justify-center items-center font-semibold text-white bg-blue py-2.5 px-4 rounded-lg transition-all duration-200 hover:bg-blue-dark text-sm shadow-sm"
              >
                Checkout →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebarModal;
