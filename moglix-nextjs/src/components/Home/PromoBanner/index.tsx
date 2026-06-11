import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Props {
  title?: string;
  subtitle?: string;
  bgColor?: string;
  link?: string;
}

const PromoBanner = ({ 
  title = "Quant Procure", 
  subtitle = "Next Day Delivery on Top Brands", 
  bgColor = "bg-green-light-5 text-green-dark",
  link = "/shop-with-sidebar"
}: Props) => {


  // Map the basic bgColors passed from Home to rich gradients
  const isGreen = bgColor.includes("green");
  const isBlue = bgColor.includes("blue");
  
  const gradientClass = isGreen 
    ? "bg-gradient-to-r from-green to-teal" 
    : isBlue 
      ? "bg-gradient-to-r from-blue to-blue-dark" 
      : "bg-gradient-to-r from-dark to-dark-2";

  return (
    <section className="py-8">
      <div className="max-w-[1300px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className={`relative overflow-hidden rounded-2xl ${gradientClass} shadow-xl hover:shadow-2xl transition-shadow duration-300 py-10 px-8 sm:px-14 flex flex-col md:flex-row items-center justify-between group`}>
          
          {/* Decorative Background Elements */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:opacity-20 transition-opacity duration-500" />
          <div className="absolute left-0 bottom-0 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4 group-hover:scale-110 transition-transform duration-500" />
          
          <div className="relative z-10 max-w-[600px] w-full text-center md:text-left mb-6 md:mb-0">
            <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full mb-3 tracking-widest uppercase border border-white/30">
              Limited Offer
            </span>
            <h2 className="font-black text-3xl md:text-4xl lg:text-5xl text-white mb-3 tracking-tight">
              {title}
            </h2>
            <p className="font-medium text-lg text-white/90">
              {subtitle}
            </p>
          </div>

          <div className="relative z-10 flex gap-4">
            <Link
              href={link}
              className="inline-flex items-center gap-2 font-bold text-sm text-dark bg-white py-3.5 px-8 rounded-lg shadow-lg hover:bg-gray-1 hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              Shop Now <ChevronRight size={18} />
            </Link>

          </div>
          
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;

