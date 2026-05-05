import Link from "next/link";
import React from "react";
import { ChevronRight } from "lucide-react";


const Breadcrumb = ({ title, pages }: { title: string; pages: string[] }) => {
  return (
    <div className="w-full pt-[160px] pb-0 bg-[#F4F5F9]">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        
        {/* Breadcrumb Trail */}
        <div className="text-sm text-dark-3 flex items-center gap-2">
          <Link href="/" className="hover:text-blue cursor-pointer transition-colors">
            Home
          </Link>
          
          {pages.map((page, key) => (
            <React.Fragment key={key}>
              <ChevronRight size={14} className="text-gray-4" />
              <span className={`capitalize ${key === pages.length - 1 ? 'text-dark font-medium' : 'hover:text-blue cursor-pointer transition-colors'}`}>

                {key === pages.length - 1 ? (
                  page
                ) : (
                  <Link href={`/${page.toLowerCase().replace(/ /g, "-")}`}>
                    {page}
                  </Link>
                )}
              </span>
            </React.Fragment>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Breadcrumb;
