import React, { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
}

export function PageHeader({ title, description, icon }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-start gap-4">
        {icon && (
          <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            {icon}
          </div>
        )}
        <div className="grid gap-1">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-gray-500">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
} 