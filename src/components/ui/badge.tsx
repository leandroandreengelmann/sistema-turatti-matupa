import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  className?: string;
}

export function Badge({ 
  children, 
  variant = 'default', 
  className = '',
  ...props 
}: BadgeProps) {
  const baseClass = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
  
  const variantClasses = {
    default: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    outline: 'bg-transparent border border-gray-200 text-gray-700 hover:bg-gray-50',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
  };

  return (
    <span 
      className={cn(baseClass, variantClasses[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
} 