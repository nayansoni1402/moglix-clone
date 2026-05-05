import React from "react";
import Link from "next/link";

const categories = [
  { name: "24 Hrs Delivery", link: "#", icon: "⚡", highlight: true },
  { name: "Electrical", link: "/category/electrical", icon: "💡" },
  { name: "Power Tools", link: "/category/power-tools", icon: "🔧" },
  { name: "Office Supplies", link: "/category/office", icon: "🗂️" },
  { name: "Agri & Garden", link: "/category/agri", icon: "🌱" },
  { name: "Medical & Lab", link: "/category/medical", icon: "🧪" },
  { name: "Construction", link: "/category/construction", icon: "🏗️" },
  { name: "Safety Gear", link: "/category/safety", icon: "🦺" },
  { name: "Automotive", link: "/category/automotive", icon: "🚗" },
  { name: "Packaging", link: "/category/packaging", icon: "📦" },
  { name: "Mogli Express", link: "#", icon: "🚀", highlight: true },
];

const CategoryStrip = () => {
  return (
    <div className="w-full bg-white border-b border-gray-3 shadow-sm hidden lg:block">
      <div className="max-w-[1300px] mx-auto px-4 xl:px-0">
        <div className="flex items-center overflow-x-auto scrollbar-hide">
          {categories.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-3 text-xs font-semibold border-b-2 transition-all duration-200 hover:border-blue hover:text-blue ${
                item.highlight
                  ? "text-red border-red hover:border-red hover:text-red"
                  : "text-dark-2 border-transparent"
              }`}
            >
              <span className="text-sm">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryStrip;

