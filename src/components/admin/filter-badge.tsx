import React from 'react';
import { cn } from '@/lib/utils';

interface FilterBadgeProps {
  label: string;
  active: boolean;
  onClick: () => void;
  className?: string;
}

export function FilterBadge({ 
  label, 
  active, 
  onClick,
  className 
}: FilterBadgeProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium transition-colors',
        active
          ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        className
      )}
    >
      {label}
    </button>
  );
} 