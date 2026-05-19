"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const AuthPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("hasSeenAuthPopup");
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("hasSeenAuthPopup", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md" 
        onClick={handleClose}
      ></div>

      {/* Premium Split-Screen Popup */}
      <div className="relative bg-white w-full max-w-[800px] rounded-[32px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border-[6px] border-white overflow-hidden flex flex-col md:row animate-zoomIn">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 text-dark hover:bg-red hover:text-white transition-all shadow-md"
        >
          ✕
        </button>

        <div className="flex flex-col md:flex-row w-full">
          {/* Left Side: Offer Banner */}
          <div className="w-full md:w-[45%] h-[200px] md:h-auto relative bg-blue/5">
            <Image 
              src="/newsletter-banner.png" 
              alt="Offer Banner" 
              fill 
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue/70 to-transparent flex flex-col justify-end p-8">
               <h3 className="text-white text-3xl font-black leading-none uppercase tracking-tighter">Claim Your<br/>Discount</h3>
               <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mt-2">Limited Time Offer</p>
            </div>
          </div>

          {/* Right Side: Auth Form */}
          <div className="w-full md:w-[55%] p-8 md:p-12 bg-white">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-dark mb-1 tracking-tighter uppercase leading-tight">
                {isLogin ? "Welcome Back" : "Sign Up & Save"}
              </h2>
              <p className="text-dark-4 text-xs font-bold uppercase tracking-wide">
                {isLogin ? "Sign in to your account" : "Get $50 OFF on your first order"}
              </p>
            </div>

            <form className="space-y-3">
              {!isLogin && (
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  className="w-full bg-gray-1 border-2 border-transparent focus:border-blue/10 focus:bg-white rounded-xl px-5 py-4 text-sm outline-none transition-all font-bold"
                />
              )}
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-gray-1 border-2 border-transparent focus:border-blue/10 focus:bg-white rounded-xl px-5 py-4 text-sm outline-none transition-all font-bold"
              />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full bg-gray-1 border-2 border-transparent focus:border-blue/10 focus:bg-white rounded-xl px-5 py-4 text-sm outline-none transition-all font-bold"
              />
              
              <button 
                type="button"
                className="w-full bg-blue text-white py-5 rounded-xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-blue-dark transition-all active:scale-95 mt-4"
              >
                {isLogin ? "Log In" : "Claim Discount"}
              </button>
            </form>

            {/* Switcher */}
            <div className="mt-8 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-xs text-dark-4 font-black uppercase tracking-widest hover:text-blue transition-colors underline decoration-blue/20 underline-offset-4"
              >
                {isLogin ? "New user? Create an account" : "Already a member? Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPopup;
