import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Package2, 
  Palette, 
  Store, 
  Image, 
  Users, 
  LayoutDashboard,
  ArrowRightCircle,
  Menu,
  X,
  Layers,
  List,
  Tags as TagsIcon,
  FileImage,
  FootprintsIcon
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin',
    color: 'from-sky-400 to-indigo-400'
  },
  {
    title: 'Produtos',
    icon: Package2,
    href: '/admin/products',
    color: 'from-cyan-400 to-sky-400'
  },
  {
    title: 'Categorias',
    icon: Layers,
    href: '/admin/categories',
    color: 'from-green-400 to-emerald-400'
  },
  {
    title: 'Subcategorias',
    icon: List,
    href: '/admin/subcategories',
    color: 'from-blue-400 to-indigo-400'
  },
  {
    title: 'Taxonomia',
    icon: TagsIcon,
    href: '/admin/taxonomy',
    color: 'from-teal-400 to-green-400'
  },
  {
    title: 'Coleções',
    icon: Palette,
    href: '/admin/collections',
    color: 'from-indigo-400 to-purple-400'
  },
  {
    title: 'Cores',
    icon: Palette,
    href: '/admin/colors',
    color: 'from-violet-400 to-fuchsia-400'
  },
  {
    title: 'Banners',
    icon: Image,
    href: '/admin/banners',
    color: 'from-rose-400 to-pink-400'
  },
  {
    title: 'Logos',
    icon: FileImage,
    href: '/admin/logos',
    color: 'from-fuchsia-400 to-pink-400'
  },
  {
    title: 'Rodapé',
    icon: FootprintsIcon,
    href: '/admin/footer-images',
    color: 'from-pink-400 to-orange-400'
  },
  {
    title: 'Lojas',
    icon: Store,
    href: '/admin/stores',
    color: 'from-emerald-400 to-teal-400'
  },
  {
    title: 'Vendedores',
    icon: Users,
    href: '/admin/sellers',
    color: 'from-amber-400 to-orange-400'
  },
];

interface AdminSidebarProps {
  onToggle?: (collapsed: boolean) => void;
}

export default function AdminSidebar({ onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState(-1);
  const asideRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Fechar o menu no mobile quando mudar de página
    if (isMobile) {
      setIsOpen(false);
    }
    
    // Encontrar o item ativo com base no pathname
    const activeIndex = menuItems.findIndex(item => pathname === item.href);
    setActiveItemIndex(activeIndex);
  }, [pathname, isMobile]);

  useEffect(() => {
    // Notificar o componente pai sobre a mudança no estado de collapsing
    if (onToggle) {
      onToggle(isCollapsed);
    }
  }, [isCollapsed, onToggle]);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleItemHover = (index: number) => {
    if (!isCollapsed) return;
    setActiveItemIndex(index);
  };

  const handleItemLeave = () => {
    if (!isCollapsed) return;
    // Retornar ao item ativo com base no pathname
    const activeIndex = menuItems.findIndex(item => pathname === item.href);
    setActiveItemIndex(activeIndex);
  };

  // Detector de clique fora do menu para fechá-lo no mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && isOpen && 
          asideRef.current && 
          !asideRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, isOpen]);

  // Inicializar o array de refs
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, menuItems.length);
  }, []);

  return (
    <>
      {/* Botão flutuante para mobile */}
      <button
        onClick={toggleSidebar}
        className={`
          lg:hidden fixed bottom-6 right-6 z-50 
          p-3.5 rounded-full shadow-lg 
          bg-gradient-to-r from-sky-500 to-indigo-500 
          text-white transition-all duration-300 transform
          hover:scale-110 active:scale-95
          ${isOpen ? 'rotate-90' : 'rotate-0'}
        `}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Menu principal */}
      <aside 
        ref={asideRef}
        className={`
          fixed z-40 
          transition-all duration-500 ease-out
          ${isMobile 
            ? isOpen 
              ? 'inset-0' 
              : 'inset-0 pointer-events-none'
            : isCollapsed 
              ? 'left-0 top-0 bottom-0 w-20' 
              : 'left-0 top-0 bottom-0 w-72'
          }
        `}
        style={{
          backdropFilter: 'blur(10px)'
        }}
      >
        {/* Overlay para mobile */}
        {isMobile && (
          <div 
            className={`
              absolute inset-0 bg-slate-900/30 backdrop-blur-sm
              transition-opacity duration-500
              ${isOpen ? 'opacity-100' : 'opacity-0'}
            `}
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Container do menu */}
        <div 
          className={`
            absolute flex flex-col
            bg-white/80 dark:bg-slate-900/80 
            border-r border-slate-200 dark:border-slate-700
            shadow-xl backdrop-blur-md
            transition-all duration-500 ease-out
            h-full
            ${isMobile 
              ? isOpen 
                ? 'left-0 w-72' 
                : '-left-80 w-72'
              : isCollapsed 
                ? 'w-20' 
                : 'w-72'
            }
          `}
        >
          {/* Header */}
          <div className="relative h-16 flex items-center px-4 border-b border-slate-200 dark:border-slate-700/50">
            <div className={`
              flex items-center
              transition-all duration-500
              ${isCollapsed && !isMobile ? 'opacity-0 scale-90' : 'opacity-100'}
            `}>
              <Link href="/admin" className="flex items-center space-x-2">
                {/* Logo animado */}
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-md">
                  <span className="text-white text-lg font-bold">T</span>
                </div>
                <span className={`
                  text-xl font-bold text-blue-600
                  transition-all duration-300
                  ${isCollapsed && !isMobile ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'}
                `}>
                  Turatti
                </span>
              </Link>
            </div>
            
            {/* Botão para desktop */}
            {!isMobile && (
              <button
                onClick={toggleSidebar}
                className="absolute right-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ArrowRightCircle 
                  className={`
                    w-5 h-5 text-slate-500
                    transition-transform duration-300
                    ${isCollapsed ? 'rotate-180' : 'rotate-0'}
                  `}
                />
              </button>
            )}
          </div>

          {/* Menu Items com Scroll */}
          <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            <div className="px-3">
              {/* Itens do Menu */}
              <div>
                {!isCollapsed && <p className="text-lg font-medium text-slate-500 mb-3 px-3">MENU</p>}
                <div className="space-y-1">
                  {menuItems.map((item, index) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    const isHovered = activeItemIndex === index;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`
                          relative block outline-none
                          transition-all duration-200
                        `}
                      >
                        <div
                          ref={(el) => {
                            itemRefs.current[index] = el;
                            return undefined;
                          }}
                          className={`
                            group flex items-center
                            rounded-xl py-2.5
                            transition-all duration-200
                            ${isCollapsed && !isMobile ? 'px-2 justify-center mx-2' : 'px-3 mx-0'}
                            ${isActive 
                              ? 'text-white shadow-md' 
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                            }
                            outline-none cursor-pointer
                          `}
                          onMouseEnter={() => handleItemHover(index)}
                          onMouseLeave={handleItemLeave}
                          style={{
                            background: isActive ? `linear-gradient(to right, var(--tw-gradient-stops))` : '',
                            backgroundImage: isActive ? `linear-gradient(to right, ${item.color.split(' ')[0]}, ${item.color.split(' ')[1]})` : '',
                          }}
                        >
                          {/* Ícone */}
                          <div className={`
                            flex items-center justify-center
                            rounded-lg
                            transition-all duration-200 ease-out
                            ${isCollapsed && !isMobile ? 'w-10 h-10' : 'w-8 h-8 mr-3'}
                            ${isActive ? 'bg-white/20 text-white' : `text-slate-500 group-hover:text-${item.color.split('-')[1]}-500`}
                          `}>
                            <Icon className="w-5 h-5" />
                          </div>
                          
                          {/* Texto */}
                          {(!isCollapsed || isMobile) && (
                            <span className="text-lg font-medium">
                              {item.title}
                            </span>
                          )}
                          
                          {/* Tooltip para modo colapsado */}
                          {isCollapsed && !isMobile && (
                            <div className={`
                              absolute left-full ml-3 px-2.5 py-1.5 
                              rounded-lg shadow-lg
                              text-lg font-medium text-white
                              bg-gradient-to-r ${item.color}
                              transition-all duration-200
                              z-50 whitespace-nowrap
                              ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'}
                            `}>
                              {item.title}
                            </div>
                          )}
                        </div>

                        {/* Indicador de ativo */}
                        {isActive && !isCollapsed && (
                          <span className="absolute top-0 right-0 bottom-0 w-1 bg-white rounded-l-full transform translate-x-3"></span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Footer com perfil */}
          <div className="border-t border-slate-200 dark:border-slate-700/50 p-4">
            <div className={`
              flex items-center
              transition-all duration-300
              ${isCollapsed && !isMobile ? 'justify-center' : 'space-x-3'}
            `}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 p-0.5">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <span className="text-sm font-semibold bg-gradient-to-br from-sky-500 to-indigo-500 bg-clip-text text-transparent">AT</span>
                </div>
              </div>
              
              {(!isCollapsed || isMobile) && (
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-medium text-blue-600 truncate dark:text-blue-400">Turatti</p>
                  <p className="text-base text-slate-500 truncate dark:text-slate-400">admin@turatti.com</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
} 