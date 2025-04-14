import React, { forwardRef, ReactNode, ButtonHTMLAttributes, useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
}

interface SelectContextProps {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.MutableRefObject<HTMLButtonElement | null>;
}

const SelectContext = React.createContext<SelectContextProps | undefined>(undefined);

export function SelectTrigger({ 
  className, 
  children, 
  ...props 
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const context = React.useContext(SelectContext);
  
  if (!context) {
    throw new Error('SelectTrigger must be used within a Select component');
  }

  return (
    <button
      type="button"
      onClick={() => context.setOpen(!context.open)}
      className={cn(
        'flex items-center justify-between w-full rounded-md border',
        'border-gray-300 bg-white px-3 py-2 text-sm text-left',
        'focus:outline-none focus:ring-2 focus:ring-blue-500',
        className
      )}
      ref={(node) => {
        context.triggerRef.current = node;
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function SelectValue({ className, placeholder }: { className?: string; placeholder?: string }) {
  const context = React.useContext(SelectContext);
  
  if (!context) {
    throw new Error('SelectValue must be used within a Select component');
  }

  return (
    <span className={cn('block truncate', className)}>
      {context.value || placeholder}
    </span>
  );
}

export function SelectContent({ 
  children, 
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const context = React.useContext(SelectContext);
  
  if (!context) {
    throw new Error('SelectContent must be used within a Select component');
  }

  const { open, triggerRef } = context;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current && 
        !ref.current.contains(event.target as Node) && 
        triggerRef.current && 
        !triggerRef.current.contains(event.target as Node)
      ) {
        context.setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [context, triggerRef]);

  if (!open) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn(
        'absolute z-50 min-w-[10rem] overflow-hidden rounded-md border bg-white',
        'p-1 shadow-md animate-in fade-in-80',
        className
      )}
      {...props}
    >
      <div className="max-h-[300px] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

export function SelectItem({ 
  children, 
  value,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { value: string }) {
  const context = React.useContext(SelectContext);
  
  if (!context) {
    throw new Error('SelectItem must be used within a Select component');
  }

  const { value: selectedValue, onValueChange, setOpen } = context;
  const isSelected = selectedValue === value;

  return (
    <div
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm',
        'px-2 py-1.5 text-sm outline-none transition-colors',
        'hover:bg-gray-100 data-[highlighted]:bg-gray-100',
        isSelected ? 'bg-gray-100' : '',
        className
      )}
      onClick={() => {
        onValueChange(value);
        setOpen(false);
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function Select({ 
  value, 
  onValueChange,
  children,
  className,
  ...props
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  
  const handleValueChange = (newValue: string) => {
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <SelectContext.Provider 
      value={{ 
        value: value || '',
        onValueChange: handleValueChange,
        open,
        setOpen,
        triggerRef
      }}
    >
      <div className={cn('relative inline-block w-full', className)} {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  );
} 