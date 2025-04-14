'use client';

import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrent?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="w-full py-4 mt-8">
      <ol className="flex flex-wrap items-center text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <span className="mx-2 text-gray-500">/</span>}
            {item.isCurrent ? (
              <span className="text-gray-600">{item.label}</span>
            ) : (
              <Link href={item.href} className="text-gray-600 hover:text-blue-600 transition-colors">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
} 