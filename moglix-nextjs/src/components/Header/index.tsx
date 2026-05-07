"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAppSelector } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import { useConfig } from "@/app/context/ConfigContext";
import Image from "next/image";
import {
  Zap,
  Wrench,
  ShieldCheck,
  Lightbulb,
  TestTube2,
  Building2,
  FileBox,
  Sprout,
  Car,
  Rocket,
  User,
  Heart,
  ShoppingCart,
  Search,
  X,
  Menu as MenuIcon,
  ChevronDown
} from "lucide-react";


// ── Mega Menu Data ──────────────────────────────────────────
type SubItem = { label: string; href: string };
type Col = { heading: string; href: string; items: SubItem[] };
type NavItem = {
  name: string; link: string; icon: React.ReactNode; highlight?: boolean;
  subs?: SubItem[];
  mega?: Col[];
};

const navItems: NavItem[] = [
  {
    name: "24 Hrs Delivery", link: "#", icon: <Zap size={16} />, highlight: true,
    subs: [{ label: "Same Day Dispatch", href: "#" }, { label: "Express Shipping", href: "#" }, { label: "Track Order", href: "/my-account" }],
  },
  {
    name: "Power Tools", link: "/category/power-tools", icon: <Wrench size={16} />,

    mega: [
      {
        heading: "Drills & Drivers", href: "/category/power-tools", items: [
          { label: "Cordless Drills", href: "/category/power-tools" },
          { label: "Impact Drivers", href: "/category/power-tools" },
          { label: "Hammer Drills", href: "/category/power-tools" },
          { label: "SDS Rotary Hammers", href: "/category/power-tools" },
          { label: "Right Angle Drills", href: "/category/power-tools" },
        ]
      },
      {
        heading: "Cutting Tools", href: "/category/power-tools", items: [
          { label: "Circular Saws", href: "/category/power-tools" },
          { label: "Jigsaws", href: "/category/power-tools" },
          { label: "Reciprocating Saws", href: "/category/power-tools" },
          { label: "Tile Cutters", href: "/category/power-tools" },
          { label: "Cut-off Machines", href: "/category/power-tools" },
        ]
      },
      {
        heading: "Grinding & Sanding", href: "/category/power-tools", items: [
          { label: "Angle Grinders", href: "/category/power-tools" },
          { label: "Bench Grinders", href: "/category/power-tools" },
          { label: "Belt Sanders", href: "/category/power-tools" },
          { label: "Orbital Sanders", href: "/category/power-tools" },
          { label: "Die Grinders", href: "/category/power-tools" },
        ]
      },
      {
        heading: "More Tools", href: "/category/power-tools", items: [
          { label: "Heat Guns", href: "/category/power-tools" },
          { label: "Air Compressors", href: "/category/power-tools" },
          { label: "Nailers & Staplers", href: "/category/power-tools" },
          { label: "Planers", href: "/category/power-tools" },
          { label: "Routers", href: "/category/power-tools" },
        ]
      },
    ],
  },
  {
    name: "Safety Gear", link: "/category/safety", icon: <ShieldCheck size={16} />,

    mega: [
      {
        heading: "Head & Face", href: "/category/safety", items: [
          { label: "Safety Helmets", href: "/category/safety" },
          { label: "Face Shields", href: "/category/safety" },
          { label: "Safety Goggles", href: "/category/safety" },
          { label: "Welding Helmets", href: "/category/safety" },
        ]
      },
      {
        heading: "Body Protection", href: "/category/safety", items: [
          { label: "Hi-Vis Jackets", href: "/category/safety" },
          { label: "Coveralls & Aprons", href: "/category/safety" },
          { label: "Knee Pads", href: "/category/safety" },
          { label: "Fall Arrest Systems", href: "/category/safety" },
        ]
      },
      {
        heading: "Hands & Feet", href: "/category/safety", items: [
          { label: "Work Gloves", href: "/category/safety" },
          { label: "Cut-Resistant Gloves", href: "/category/safety" },
          { label: "Safety Shoes", href: "/category/safety" },
          { label: "Gumboots", href: "/category/safety" },
        ]
      },
      {
        heading: "Respiratory & Ear", href: "/category/safety", items: [
          { label: "N95 Respirators", href: "/category/safety" },
          { label: "Half-face Respirators", href: "/category/safety" },
          { label: "Ear Plugs", href: "/category/safety" },
          { label: "Ear Muffs", href: "/category/safety" },
        ]
      },
    ],
  },
  {
    name: "Electrical", link: "/category/electrical", icon: <Lightbulb size={16} />,

    mega: [
      {
        heading: "Wires & Cables", href: "/category/electrical", items: [
          { label: "House Wires", href: "/category/electrical" },
          { label: "Armoured Cables", href: "/category/electrical" },
          { label: "Coaxial Cables", href: "/category/electrical" },
          { label: "Flexible Cords", href: "/category/electrical" },
        ]
      },
      {
        heading: "Switchgear", href: "/category/electrical", items: [
          { label: "MCBs", href: "/category/electrical" },
          { label: "Distribution Boards", href: "/category/electrical" },
          { label: "Switches & Sockets", href: "/category/electrical" },
          { label: "Contactors & Relays", href: "/category/electrical" },
        ]
      },
      {
        heading: "Lighting", href: "/category/electrical", items: [
          { label: "LED Bulbs", href: "/category/electrical" },
          { label: "Tube Lights", href: "/category/electrical" },
          { label: "Flood Lights", href: "/category/electrical" },
          { label: "Street Lights", href: "/category/electrical" },
        ]
      },
      {
        heading: "Fans & Ventilation", href: "/category/electrical", items: [
          { label: "Ceiling Fans", href: "/category/electrical" },
          { label: "Exhaust Fans", href: "/category/electrical" },
          { label: "Industrial Blowers", href: "/category/electrical" },
          { label: "Air Circulators", href: "/category/electrical" },
        ]
      },
    ],
  },
  {
    name: "Medical", link: "/category/medical", icon: <TestTube2 size={16} />,

    subs: [
      { label: "First Aid Kits", href: "/category/medical" },
      { label: "Surgical Gloves", href: "/category/medical" },
      { label: "Face Masks & PPE", href: "/category/medical" },
    ],
  },
  {
    name: "Construction", link: "/category/construction", icon: <Building2 size={16} />,

    subs: [
      { label: "Cement & Adhesives", href: "/category/construction" },
      { label: "Hand Tools", href: "/category/construction" },
      { label: "Ladders", href: "/category/construction" },
    ],
  },
  {
    name: "Office", link: "/category/office", icon: <FileBox size={16} />,

    subs: [
      { label: "Stationery", href: "/category/office" },
      { label: "Printers", href: "/category/office" },
    ],
  },
  {
    name: "Agri & Garden", link: "/category/agri", icon: <Sprout size={16} />,

    subs: [
      { label: "Seeds", href: "/category/agri" },
      { label: "Garden Tools", href: "/category/agri" },
    ],
  },
  {
    name: "Automotive", link: "/category/automotive", icon: <Car size={16} />,

    subs: [
      { label: "Lubricants", href: "/category/automotive" },
      { label: "Batteries", href: "/category/automotive" },
    ],
  },
  {
    name: "Moglix Express", link: "#", icon: <Rocket size={16} />, highlight: true,

    subs: [{ label: "Priority Delivery", href: "#" }],
  },
];

const Header = () => {
  const { logoUrl, isMobile, isDesktop } = useConfig();
  const [searchQuery, setSearchQuery] = useState("");
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [megaOpen, setMegaOpen] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<string | null>(null);
  const { openCartModal } = useCartModalContext();

  const product = useAppSelector((state) => state.cartReducer.items);
  const wishlistItems = useAppSelector((state) => state.wishlistReducer.items);
  const totalPrice = useSelector(selectTotalPrice);

  useEffect(() => {
    const handleScroll = () => setStickyMenu(window.scrollY >= 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed left-0 top-0 w-full z-9999 bg-white transition-all ease-in-out duration-300 ${stickyMenu ? "shadow-md" : ""}`}>
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 xl:px-0">
        {/* Main Header Row */}
        <div className={`flex items-center justify-between gap-5 transition-all duration-200 ${stickyMenu ? "py-3" : "py-5"}`}>
          {/* Mobile Toggle & Logo */}
          <div className="flex items-center gap-4">
            <button onClick={() => setNavigationOpen(!navigationOpen)} className="lg:hidden text-dark text-2xl p-1 hover:bg-gray-1 rounded transition-colors">
              {navigationOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>

            <Link className="flex-shrink-0" href="/">
              <Image src={logoUrl || "/images/logo/logo.svg"} alt="Logo" width={180} height={30} className="w-auto h-7 sm:h-9" />
            </Link>
          </div>

          {/* Search Bar (Desktop Only) */}
          <div className="hidden lg:flex flex-1 max-w-[500px] mx-5 xl:mx-10">
            <div className="flex w-full items-center shadow-sm relative">
              <input
                type="text"
                placeholder="I am shopping for..."
                className="w-full bg-gray-1 border border-gray-3 py-2.5 px-4 rounded-md text-sm outline-none focus:ring-1 focus:ring-blue/30 pr-12"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-blue transition-colors">
                <Search size={18} />
              </button>

            </div>
          </div>

          {/* User Icons */}
          <div className="flex items-center gap-5 sm:gap-8">
            <Link href="/signin" className="flex items-center gap-3 group">
              <span className="text-xl group-hover:scale-110 transition-transform"><User size={24} /></span>

              <div className="hidden sm:block">
                <span className="block text-[10px] text-dark-4 uppercase font-bold leading-none">account</span>
                <p className="font-bold text-xs text-dark group-hover:text-blue transition-colors">Sign In</p>
              </div>
            </Link>

            {/* Wishlist Icon */}
            <Link href="/wishlist" className="flex items-center gap-3 group">
              <div className="relative text-xl group-hover:scale-110 transition-transform">
                <Heart size={24} />

                <span className="absolute -right-2 -top-2 bg-red text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              </div>
              <div className="hidden sm:block">
                <span className="block text-[10px] text-dark-4 uppercase font-bold leading-none">wishlist</span>
                <p className="font-bold text-xs text-dark group-hover:text-blue transition-colors">Saved</p>
              </div>
            </Link>

            <button onClick={openCartModal} className="flex items-center gap-3 group">
              <div className="relative text-xl group-hover:scale-110 transition-transform">
                <ShoppingCart size={24} />

                <span className="absolute -right-2 -top-2 bg-blue text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {product.length}
                </span>
              </div>
              <div className="hidden sm:block text-left">
                <span className="block text-[10px] text-dark-4 uppercase font-bold leading-none">cart</span>
                <p className="font-bold text-xs text-dark transition-colors">${totalPrice}</p>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Row (Only visible below lg) */}
        <div className="lg:hidden pb-4">
          <div className="relative">
            <input type="text" placeholder="Search industrial products..." className="w-full bg-gray-1 border border-gray-3 py-2.5 px-4 rounded-md text-sm outline-none" />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-4"><Search size={20} /></button>
          </div>

        </div>
      </div>

      {/* Desktop Categories Navigation */}
      <div className="border-t border-gray-3 bg-white hidden lg:block" onMouseLeave={() => setMegaOpen(null)}>
        <div className="max-w-[1300px] mx-auto px-4 xl:px-0 relative">
          <div className="flex items-center justify-between">
            {navItems.map((item, index) => (
              <div key={index} className="relative group" onMouseEnter={() => setMegaOpen(item.mega ? item.name : null)}>
                <Link
                  href={item.link}
                  className={`flex items-center gap-1.5 py-3.5 text-xs xl:text-sm font-bold border-b-2 transition-all duration-200 ${item.highlight ? "text-red border-transparent hover:border-red" : `text-dark-2 border-transparent ${megaOpen === item.name ? "text-blue border-blue" : "group-hover:text-blue group-hover:border-blue"}`
                    }`}
                >
                  <span className="text-sm xl:text-base">{item.icon}</span> {item.name}
                </Link>

                {item.subs && !item.mega && (
                  <div className="absolute top-full left-0 pt-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                    <div className="bg-white rounded-xl shadow-2xl border border-gray-2 min-w-[200px] py-2">
                      {item.subs.map((sub, si) => (
                        <Link key={si} href={sub.href} className="block px-5 py-2.5 text-sm text-dark-3 hover:bg-[#F4F5F9] hover:text-blue transition-all">{sub.label}</Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Mega Menu Panel */}
          {navItems.map((item) => (
            item.mega && megaOpen === item.name && (
              <div key={item.name} className="absolute left-0 right-0 top-full bg-white border-x border-b border-gray-3 rounded-b-2xl shadow-2xl z-50" onMouseEnter={() => setMegaOpen(item.name)}>
                <div className="grid grid-cols-4 gap-0 divide-x divide-gray-3">
                  {item.mega.map((col, ci) => (
                    <div key={ci} className="p-7">
                      <h4 className="text-sm font-bold text-dark mb-5 pb-2 border-b border-gray-2 flex items-center gap-2">
                        <span className="w-1 h-3 bg-blue rounded-full" /> {col.heading}
                      </h4>
                      <ul className="space-y-2.5">
                        {col.items.map((sub, si) => (
                          <li key={si}><Link href={sub.href} className="text-sm text-dark-4 hover:text-blue hover:translate-x-1 transition-all inline-block">{sub.label}</Link></li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Mobile Drawer (Sidebar) */}
      <div className={`fixed inset-0 z-99999 lg:hidden transition-all duration-300 ${navigationOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setNavigationOpen(false)}></div>
        <div className={`absolute top-0 left-0 bottom-0 w-[300px] bg-white shadow-2xl transition-transform duration-300 transform ${navigationOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="p-5 border-b flex justify-between items-center bg-gray-1">
            <span className="font-bold text-dark">Categories</span>
            <button onClick={() => setNavigationOpen(false)} className="text-xl"><X size={24} /></button>
          </div>

          <div className="overflow-y-auto h-full pb-24">
            {navItems.map((item, index) => (
              <div key={index} className="border-b border-gray-2">
                <div className="flex items-center justify-between p-4" onClick={() => setMobileMenuOpen(mobileMenuOpen === item.name ? null : item.name)}>
                  <Link href={item.link} className={`flex items-center gap-3 font-bold text-sm ${item.highlight ? "text-red" : "text-dark"}`} onClick={(e) => (item.mega || item.subs) && e.preventDefault()}>
                    <span className="text-lg">{item.icon}</span> {item.name}
                  </Link>
                  {(item.mega || item.subs) && <span className={`text-xs transition-transform ${mobileMenuOpen === item.name ? "rotate-180" : ""}`}><ChevronDown size={14} /></span>}
                </div>

                {(item.mega || item.subs) && mobileMenuOpen === item.name && (
                  <div className="bg-gray-1 px-5 py-3">
                    {item.mega ? item.mega.map((col, ci) => (
                      <div key={ci} className="mb-4">
                        <p className="font-bold text-xs text-dark-3 mb-2">{col.heading}</p>
                        <div className="flex flex-col gap-2 pl-3 border-l-2 border-gray-3">
                          {col.items.map((sub, si) => (<Link key={si} href={sub.href} className="text-xs text-dark-4">{sub.label}</Link>))}
                        </div>
                      </div>
                    )) : (
                      <div className="flex flex-col gap-2 pl-3 border-l-2 border-gray-3">
                        {item.subs?.map((sub, si) => (<Link key={si} href={sub.href} className="text-xs text-dark-4">{sub.label}</Link>))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;