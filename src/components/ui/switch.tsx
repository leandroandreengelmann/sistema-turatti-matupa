import React, { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SwitchProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, ...props }, ref) => {
    return (
      <label className={cn('inline-flex items-center cursor-pointer', className)}>
        <input
          type="checkbox"
          className="sr-only peer"
          ref={ref}
          {...props}
        />
        <div className={cn(
          "relative w-11 h-6 bg-gray-200 rounded-full peer",
          "peer-checked:after:translate-x-full peer-checked:after:border-white",
          "after:content-[''] after:absolute after:top-0.5 after:left-[2px]",
          "after:bg-white after:border-gray-300 after:border after:rounded-full",
          "after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
        )} />
      </label>
    );
  }
); 