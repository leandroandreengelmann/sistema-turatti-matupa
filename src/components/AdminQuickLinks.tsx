import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LinkItem {
  href: string;
  label: string;
}

interface AdminQuickLinksProps {
  links: LinkItem[];
}

export default function AdminQuickLinks({ links }: AdminQuickLinksProps) {
  const pathname = usePathname();
  
  return (
    <div className="mb-6 flex flex-wrap gap-3">
      <div className="text-sm font-medium text-gray-600 mr-2">Links rápidos:</div>
      {links.map((link, index) => (
        <div key={link.href} className="flex items-center">
          {index > 0 && <span className="text-gray-400 mr-3">|</span>}
          <Link 
            href={link.href} 
            className={`text-sm ${
              pathname === link.href 
                ? 'text-blue-800 font-medium' 
                : 'text-blue-600 hover:underline hover:text-blue-800'
            }`}
          >
            {link.label}
          </Link>
        </div>
      ))}
    </div>
  );
} 