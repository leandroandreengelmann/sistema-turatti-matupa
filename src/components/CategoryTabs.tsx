'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

type SubcategoryGroup = {
  title: string;
  items: { name: string; href: string }[];
};

type Tab = {
  name: string;
  href: string;
  subcategories: SubcategoryGroup[];
};

const categoryTabs: Tab[] = [
  {
    name: 'Kits Off-Grid',
    href: '/kits-off-grid',
    subcategories: [
      {
        title: '',
        items: [
          { name: 'Kits Iluminação', href: '/kits-off-grid/iluminacao' },
          { name: 'Kits Residenciais', href: '/kits-off-grid/residenciais' },
          { name: 'Kits Backup', href: '/kits-off-grid/backup' },
          { name: 'Kits Telecom', href: '/kits-off-grid/telecom' },
          { name: 'Kits com Controlador de Carga', href: '/kits-off-grid/controlador-carga' },
        ]
      }
    ]
  },
  {
    name: 'Kits On-Grid',
    href: '/kits-on-grid',
    subcategories: [
      {
        title: 'Residencial',
        items: [
          { name: 'Kits Residenciais com Instalação BH e Região', href: '/kits-on-grid/residencial/instalacao-bh' },
          { name: 'Kits com Microinversor', href: '/kits-on-grid/residencial/microinversor' },
          { name: 'Kits com Inversor Monofásico', href: '/kits-on-grid/residencial/inversor-monofasico' },
        ]
      },
      {
        title: 'Comercial',
        items: [
          { name: 'Kits com Inversor Trifásico 380V', href: '/kits-on-grid/comercial/trifasico-380v' },
        ]
      },
      {
        title: 'Usina',
        items: [
          { name: 'Kits com Inversor Trifásico 380V', href: '/kits-on-grid/usina/trifasico-380v' },
        ]
      }
    ]
  },
  {
    name: 'Kits Híbridos',
    href: '/kits-hibridos',
    subcategories: [
      {
        title: '',
        items: [
          { name: 'Kits Híbrido com Bateria', href: '/kits-hibridos/com-bateria' },
          { name: 'Kits Híbrido sem Bateria', href: '/kits-hibridos/sem-bateria' },
        ]
      }
    ]
  },
  {
    name: 'Kits Bombeamento',
    href: '/kits-bombeamento',
    subcategories: [
      {
        title: '',
        items: [
          { name: 'Kits para Bomba CC', href: '/kits-bombeamento/bomba-cc' },
          { name: 'Kits para Bombas Comum (CA)', href: '/kits-bombeamento/bomba-ca' },
          { name: 'Kit para Bomba de Superfície', href: '/kits-bombeamento/bomba-superficie' },
          { name: 'Kits para Bomba Sapo', href: '/kits-bombeamento/bomba-sapo' },
          { name: 'Kits para Bomba Submersa', href: '/kits-bombeamento/bomba-submersa' },
        ]
      }
    ]
  }
];

export default function CategoryTabs() {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const handleTabToggle = (tabName: string) => {
    setActiveTab(activeTab === tabName ? null : tabName);
  };

  return (
    <div className="bg-gray-50 border-b border-gray-200">
      <div className="container mx-auto">
        {/* Tabs */}
        <div className="flex flex-wrap">
          {categoryTabs.map((tab) => (
            <div key={tab.name} className="relative">
              {/* Tab Header */}
              <button
                onClick={() => handleTabToggle(tab.name)}
                className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.name 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {tab.name}
                <ChevronDown 
                  className={`ml-1 h-4 w-4 transition-transform ${
                    activeTab === tab.name ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {/* Tab Content */}
              {activeTab === tab.name && (
                <div className="absolute left-0 w-full bg-white shadow-lg z-40 border-t border-gray-200">
                  <div className="container mx-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                      {tab.subcategories.map((group, groupIndex) => (
                        <div key={groupIndex} className="space-y-3">
                          {group.title && (
                            <h3 className="text-lg font-semibold text-gray-800">{group.title}</h3>
                          )}
                          <ul className="space-y-2">
                            {group.items.map((item) => (
                              <li key={item.name}>
                                <Link 
                                  href={item.href}
                                  className="text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 