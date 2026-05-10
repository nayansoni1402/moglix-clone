import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import type { BreadcrumbItem } from "@/types/product";

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  productName: string;
}

export default function Breadcrumbs({ items, productName }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1 text-xs text-gray-5 overflow-x-auto whitespace-nowrap scrollbar-hide py-1">
        <li className="flex items-center shrink-0">
          <Link
            href="/"
            className="flex items-center gap-1 text-blue hover:text-blue-dark transition-colors font-medium"
          >
            <Home size={13} />
            <span>Home</span>
          </Link>
        </li>

        {items.slice(0, -1).map((item, idx) => (
          <li key={idx} className="flex items-center gap-1 shrink-0">
            <ChevronRight size={12} className="text-gray-4" />
            <Link
              href={`/${item.categoryLink}`}
              className="text-blue hover:text-blue-dark transition-colors font-medium hover:underline"
            >
              {item.categoryName}
            </Link>
          </li>
        ))}

        <li className="flex items-center gap-1 shrink-0">
          <ChevronRight size={12} className="text-gray-4" />
          <span className="text-body font-semibold truncate max-w-[200px] sm:max-w-[400px]">
            {productName}
          </span>
        </li>
      </ol>
    </nav>
  );
}
