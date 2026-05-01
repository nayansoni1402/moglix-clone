import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import React from 'react';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex text-sm text-gray-500 mb-6 items-center space-x-2" aria-label="Breadcrumb">
      <Link href="/" className="hover:text-red-600 transition-colors flex items-center">
        <Home className="w-4 h-4" />
        <span className="sr-only">Home</span>
      </Link>
      
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <React.Fragment key={`${item.label}-${index}`}>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            {isLast || !item.href ? (
              <span className="text-gray-900 font-medium truncate" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="hover:text-red-600 transition-colors truncate">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
