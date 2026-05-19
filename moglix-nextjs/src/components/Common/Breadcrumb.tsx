import Link from "next/link";
import React from "react";
import { ChevronRight, Home } from "lucide-react";


const Breadcrumb = ({ title, pages }: { title: string; pages: string[] }) => {
  return (
    <div className="w-full pt-[160px] pb-0 bg-[#F4F5F9]" style={{ backgroundColor: "#F4F5F9" }}>
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        
        {/* Breadcrumb Trail */}
        <nav aria-label="Breadcrumb" className="mb-2">
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
            
            {pages.map((page, key) => {
              const isLast = key === pages.length - 1;
              return (
                <li key={key} className="flex items-center gap-1 shrink-0">
                  <ChevronRight size={12} className="text-gray-4" />
                  {isLast ? (
                    <span className="text-body font-semibold capitalize truncate max-w-[200px] sm:max-w-[400px]">
                      {page}
                    </span>
                  ) : (
                    <Link
                      href={`/${page.toLowerCase().replace(/ /g, "-")}`}
                      className="text-blue hover:text-blue-dark transition-colors font-medium hover:underline capitalize"
                    >
                      {page}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

      </div>
    </div>
  );
};

export default Breadcrumb;
