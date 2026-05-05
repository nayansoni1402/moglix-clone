"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import CustomSelect from "./CustomSelect";
import { useAppSelector } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import Image from "next/image";

// ── Mega Menu Data ──────────────────────────────────────────
type SubItem = { label: string; href: string };
type Col = { heading: string; href: string; items: SubItem[] };
type NavItem = {
  name: string; link: string; icon: string; highlight?: boolean;
  subs?: SubItem[];
  mega?: Col[];
};

const navItems: NavItem[] = [
  {
    name: "24 Hrs Delivery", link: "#", icon: "⚡", highlight: true,
    subs: [{ label: "Same Day Dispatch", href: "#" }, { label: "Express Shipping", href: "#" }, { label: "Track Order", href: "/my-account" }],
  },
  {
    name: "Power Tools", link: "/category/power-tools", icon: "🔧",
    mega: [
      { heading: "Drills & Drivers", href: "/category/power-tools", items: [
        { label: "Cordless Drills", href: "/category/power-tools" },
        { label: "Impact Drivers", href: "/category/power-tools" },
        { label: "Hammer Drills", href: "/category/power-tools" },
        { label: "SDS Rotary Hammers", href: "/category/power-tools" },
        { label: "Right Angle Drills", href: "/category/power-tools" },
      ]},
      { heading: "Cutting Tools", href: "/category/power-tools", items: [
        { label: "Circular Saws", href: "/category/power-tools" },
        { label: "Jigsaws", href: "/category/power-tools" },
        { label: "Reciprocating Saws", href: "/category/power-tools" },
        { label: "Tile Cutters", href: "/category/power-tools" },
        { label: "Cut-off Machines", href: "/category/power-tools" },
      ]},
      { heading: "Grinding & Sanding", href: "/category/power-tools", items: [
        { label: "Angle Grinders", href: "/category/power-tools" },
        { label: "Bench Grinders", href: "/category/power-tools" },
        { label: "Belt Sanders", href: "/category/power-tools" },
        { label: "Orbital Sanders", href: "/category/power-tools" },
        { label: "Die Grinders", href: "/category/power-tools" },
      ]},
      { heading: "More Tools", href: "/category/power-tools", items: [
        { label: "Heat Guns", href: "/category/power-tools" },
        { label: "Air Compressors", href: "/category/power-tools" },
        { label: "Nailers & Staplers", href: "/category/power-tools" },
        { label: "Planers", href: "/category/power-tools" },
        { label: "Routers", href: "/category/power-tools" },
      ]},
    ],
  },
  {
    name: "Safety Gear", link: "/category/safety", icon: "🦺",
    mega: [
      { heading: "Head & Face", href: "/category/safety", items: [
        { label: "Safety Helmets", href: "/category/safety" },
        { label: "Face Shields", href: "/category/safety" },
        { label: "Safety Goggles", href: "/category/safety" },
        { label: "Welding Helmets", href: "/category/safety" },
      ]},
      { heading: "Body Protection", href: "/category/safety", items: [
        { label: "Hi-Vis Jackets", href: "/category/safety" },
        { label: "Coveralls & Aprons", href: "/category/safety" },
        { label: "Knee Pads", href: "/category/safety" },
        { label: "Fall Arrest Systems", href: "/category/safety" },
      ]},
      { heading: "Hands & Feet", href: "/category/safety", items: [
        { label: "Work Gloves", href: "/category/safety" },
        { label: "Cut-Resistant Gloves", href: "/category/safety" },
        { label: "Safety Shoes", href: "/category/safety" },
        { label: "Gumboots", href: "/category/safety" },
      ]},
      { heading: "Respiratory & Ear", href: "/category/safety", items: [
        { label: "N95 Respirators", href: "/category/safety" },
        { label: "Half-face Respirators", href: "/category/safety" },
        { label: "Ear Plugs", href: "/category/safety" },
        { label: "Ear Muffs", href: "/category/safety" },
      ]},
    ],
  },
  {
    name: "Electrical", link: "/category/electrical", icon: "💡",
    mega: [
      { heading: "Wires & Cables", href: "/category/electrical", items: [
        { label: "House Wires", href: "/category/electrical" },
        { label: "Armoured Cables", href: "/category/electrical" },
        { label: "Coaxial Cables", href: "/category/electrical" },
        { label: "Flexible Cords", href: "/category/electrical" },
      ]},
      { heading: "Switchgear", href: "/category/electrical", items: [
        { label: "MCBs", href: "/category/electrical" },
        { label: "Distribution Boards", href: "/category/electrical" },
        { label: "Switches & Sockets", href: "/category/electrical" },
        { label: "Contactors & Relays", href: "/category/electrical" },
      ]},
      { heading: "Lighting", href: "/category/electrical", items: [
        { label: "LED Bulbs", href: "/category/electrical" },
        { label: "Tube Lights", href: "/category/electrical" },
        { label: "Flood Lights", href: "/category/electrical" },
        { label: "Street Lights", href: "/category/electrical" },
      ]},
      { heading: "Fans & Ventilation", href: "/category/electrical", items: [
        { label: "Ceiling Fans", href: "/category/electrical" },
        { label: "Exhaust Fans", href: "/category/electrical" },
        { label: "Industrial Blowers", href: "/category/electrical" },
        { label: "Air Circulators", href: "/category/electrical" },
      ]},
    ],
  },
  {
    name: "Medical", link: "/category/medical", icon: "🧪",
    subs: [
      { label: "First Aid Kits", href: "/category/medical" },
      { label: "Surgical Gloves", href: "/category/medical" },
      { label: "Face Masks & PPE", href: "/category/medical" },
      { label: "Sanitizers", href: "/category/medical" },
      { label: "Medical Instruments", href: "/category/medical" },
    ],
  },
  {
    name: "Construction", link: "/category/construction", icon: "🏗️",
    subs: [
      { label: "Cement & Adhesives", href: "/category/construction" },
      { label: "Hand Tools", href: "/category/construction" },
      { label: "Ladders & Scaffolding", href: "/category/construction" },
      { label: "Measuring Tools", href: "/category/construction" },
      { label: "Fasteners & Anchors", href: "/category/construction" },
    ],
  },
  {
    name: "Office", link: "/category/office", icon: "🗂️",
    subs: [
      { label: "Stationery", href: "/category/office" },
      { label: "Printers & Toners", href: "/category/office" },
      { label: "Office Furniture", href: "/category/office" },
      { label: "Filing & Storage", href: "/category/office" },
    ],
  },
  {
    name: "Agri & Garden", link: "/category/agri", icon: "🌱",
    subs: [
      { label: "Seeds & Fertilizers", href: "/category/agri" },
      { label: "Garden Tools", href: "/category/agri" },
      { label: "Irrigation Systems", href: "/category/agri" },
      { label: "Pesticides", href: "/category/agri" },
    ],
  },
  {
    name: "Automotive", link: "/category/automotive", icon: "🚗",
    subs: [
      { label: "Lubricants & Oils", href: "/category/automotive" },
      { label: "Batteries", href: "/category/automotive" },
      { label: "Tyres & Accessories", href: "/category/automotive" },
      { label: "Car Care Products", href: "/category/automotive" },
    ],
  },
  {
    name: "Moglix Express", link: "#", icon: "🚀", highlight: true,
    subs: [{ label: "Priority Delivery", href: "#" }, { label: "Express Catalog", href: "#" }],
  },
];

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [megaOpen, setMegaOpen] = useState<string | null>(null);
  const { openCartModal } = useCartModalContext();

  const product = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);

  const handleOpenCartModal = () => {
    openCartModal();
  };

  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
    return () => window.removeEventListener("scroll", handleStickyMenu);
  }, []);

  const options = [
    { label: "All Categories", value: "0" },
    { label: "Power Tools", value: "1" },
    { label: "Safety Gear", value: "2" },
    { label: "Electrical", value: "3" },
  ];

  return (
    <header
      className={`fixed left-0 top-0 w-full z-9999 bg-white transition-all ease-in-out duration-300 ${
        stickyMenu && "shadow-md"
      }`}
    >
      <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0">
        {/* Header Top */}
        <div className={`flex flex-col lg:flex-row gap-5 items-end lg:items-center xl:justify-between ease-out duration-200 ${
          stickyMenu ? "py-3" : "py-5"
        }`}>
          <div className="xl:w-auto flex-col sm:flex-row w-full flex sm:justify-between sm:items-center gap-5 sm:gap-10">
            <Link className="flex-shrink-0" href="/">
              <Image src="/images/logo/logo.svg" alt="Logo" width={180} height={30} />
            </Link>

            <div className="max-w-[475px] w-full">
              <form>
                <div className="flex items-center">
                  <CustomSelect options={options} />
                  <div className="relative max-w-[333px] sm:min-w-[333px] w-full">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 inline-block w-px h-5.5 bg-gray-4"></span>
                    <input
                      onChange={(e) => setSearchQuery(e.target.value)}
                      value={searchQuery}
                      type="search"
                      placeholder="I am shopping for..."
                      className="w-full rounded-r-[5px] bg-gray-1 !border-l-0 border border-gray-3 py-2.5 pl-4 pr-10 outline-none focus:ring-1 focus:ring-blue/30 transition-all"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-blue transition-colors">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.2687 15.6656L12.6281 11.8969C14.5406 9.28123 14.3437 5.5406 11.9531 3.1781C10.6875 1.91248 8.99995 1.20935 7.19995 1.20935C5.39995 1.20935 3.71245 1.91248 2.44683 3.1781C-0.168799 5.79373 -0.168799 10.0687 2.44683 12.6844C3.71245 13.95 5.39995 14.6531 7.19995 14.6531C8.91558 14.6531 10.5187 14.0062 11.7843 12.8531L16.4812 16.65C16.5937 16.7344 16.7343 16.7906 16.875 16.7906C17.0718 16.7906 17.2406 16.7062 17.3531 16.5656C17.5781 16.2844 17.55 15.8906 17.2687 15.6656ZM7.19995 13.3875C5.73745 13.3875 4.38745 12.825 3.34683 11.7844C1.20933 9.64685 1.20933 6.18748 3.34683 4.0781C4.38745 3.03748 5.73745 2.47498 7.19995 2.47498C8.66245 2.47498 10.0125 3.03748 11.0531 4.0781C13.1906 6.2156 13.1906 9.67498 11.0531 11.7844C10.0406 12.825 8.66245 13.3875 7.19995 13.3875Z" fill="currentColor"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden xl:flex items-center gap-3">
              <span className="text-xl">📞</span>
              <div>
                <span className="block text-[10px] text-dark-4 uppercase leading-none">24/7 SUPPORT</span>
                <p className="font-bold text-xs text-dark">1800-XXX-XXXX</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <Link href="/signin" className="flex items-center gap-2.5 group">
                <span className="text-xl group-hover:scale-110 transition-transform">👤</span>
                <div>
                  <span className="block text-[10px] text-dark-4 uppercase leading-none">account</span>
                  <p className="font-bold text-xs text-dark group-hover:text-blue transition-colors">Sign In</p>
                </div>
              </Link>
              <button onClick={handleOpenCartModal} className="flex items-center gap-2.5 group">
                <span className="relative text-xl group-hover:scale-110 transition-transform">
                  🛒
                  <span className="absolute -right-2 -top-2 bg-blue text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {product.length}
                  </span>
                </span>
                <div>
                  <span className="block text-[10px] text-dark-4 uppercase leading-none">cart</span>
                  <p className="font-bold text-xs text-dark">${totalPrice}</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="border-t border-gray-3 bg-white hidden lg:block" onMouseLeave={() => setMegaOpen(null)}>
        <div className="max-w-[1170px] mx-auto px-4 xl:px-0 relative">
          <div className="flex items-center justify-between">
            {navItems.map((item, index) => (
              <div
                key={index}
                className="relative group"
                onMouseEnter={() => setMegaOpen(item.mega ? item.name : null)}
              >
                <Link
                  href={item.link}
                  className={`flex items-center gap-1.5 py-3 text-xs font-bold transition-all ${
                    item.highlight
                      ? "text-red hover:text-red-600"
                      : `text-dark-2 hover:text-blue ${megaOpen === item.name ? "text-blue border-b-2 border-blue" : "border-b-2 border-transparent"}`
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  {item.name}
                  {(item.subs || item.mega) && (
                    <svg className={`w-2.5 h-2.5 ml-0.5 transition-transform ${megaOpen === item.name ? "rotate-180" : ""}`} fill="none" viewBox="0 0 10 6">
                      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </Link>

                {/* Simple Dropdown - CLEAN VERSION */}
                {item.subs && !item.mega && (
                  <div className="absolute top-full left-0 pt-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                    <div className="bg-white rounded-xl shadow-xl border border-gray-2 min-w-[200px] py-2">
                      <ul className="space-y-0.5">
                        {item.subs.map((sub, si) => (
                          <li key={si}>
                            <Link href={sub.href} className="block px-4 py-2 text-sm text-dark-3 hover:bg-[#F4F5F9] hover:text-blue transition-colors">
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mega Menu Panel - CLEAN VERSION (No Blue Header) */}
          {navItems.map((item) =>
            item.mega && megaOpen === item.name ? (
              <div key={item.name} className="absolute left-0 right-0 top-full z-50 pt-0" onMouseEnter={() => setMegaOpen(item.name)}>
                <div className="bg-white border-x border-b border-gray-3 rounded-b-2xl shadow-2xl p-6 grid grid-cols-4 gap-8">
                  {item.mega.map((col, ci) => (
                    <div key={ci}>
                      <h4 className="text-sm font-bold text-dark mb-4 pb-2 border-b border-[#F4F5F9] flex items-center gap-2">
                        <span className="w-1 h-3 bg-blue rounded-full" />
                        {col.heading}
                      </h4>
                      <ul className="space-y-2">
                        {col.items.map((sub, si) => (
                          <li key={si}>
                            <Link href={sub.href} className="text-sm text-dark-4 hover:text-blue hover:translate-x-1 transition-all inline-block">
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
