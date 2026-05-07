import Link from "next/link";
import {
  Zap,
  Lightbulb,
  Wrench,
  FileBox,
  Sprout,
  TestTube2,
  Building2,
  ShieldCheck,
  Car,
  Package,
  Rocket
} from "lucide-react";

const categories = [
  { name: "24 Hrs Delivery", link: "#", icon: <Zap size={16} />, highlight: true },
  { name: "Electrical", link: "/category/electrical", icon: <Lightbulb size={16} /> },
  { name: "Power Tools", link: "/category/power-tools", icon: <Wrench size={16} /> },
  { name: "Office Supplies", link: "/category/office", icon: <FileBox size={16} /> },
  { name: "Agri & Garden", link: "/category/agri", icon: <Sprout size={16} /> },
  { name: "Medical & Lab", link: "/category/medical", icon: <TestTube2 size={16} /> },
  { name: "Construction", link: "/category/construction", icon: <Building2 size={16} /> },
  { name: "Safety Gear", link: "/category/safety", icon: <ShieldCheck size={16} /> },
  { name: "Automotive", link: "/category/automotive", icon: <Car size={16} /> },
  { name: "Packaging", link: "/category/packaging", icon: <Package size={16} /> },
  { name: "Mogli Express", link: "#", icon: <Rocket size={16} />, highlight: true },
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

