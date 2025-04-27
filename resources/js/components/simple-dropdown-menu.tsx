import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Link } from '@inertiajs/react';

// Tipe sederhana untuk menghindari masalah TypeScript
type MenuItem = {
  title: string;
  href?: string;
  icon?: any;
  submenu?: MenuItem[];
};

export function SimpleDropdownMenu({ item, isActive = false }: { item: MenuItem; isActive?: boolean }) {
  const [isOpen, setIsOpen] = useState(isActive);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full py-1">
      {/* Dropdown header */}
      <button
        onClick={toggleDropdown}
        className={`flex w-full items-center justify-between rounded-md p-2 text-sm ${
          isActive ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
        }`}
      >
        <div className="flex items-center gap-2">
          {item.icon && <item.icon className="h-5 w-5" />}
          <span>{item.title}</span>
        </div>
        {isOpen ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>

      {/* Dropdown items */}
      {isOpen && item.submenu && (
        <div className="mt-1 ml-6 space-y-1">
          {item.submenu.map((subitem, index) => (
            <Link
            key={index}
            href={subitem.href || '#'}
            className="flex items-center rounded-md p-2 text-sm hover:bg-muted"
            // Tambahkan ini
            onClick={(e) => {
              // Force navigasi
              window.location.href = subitem.href || '#';
            }}
          >
            {subitem.icon && <subitem.icon className="mr-2 h-5 w-5" />}
            <span>{subitem.title}</span>
          </Link>
          ))}
        </div>
      )}
    </div>
  );
}