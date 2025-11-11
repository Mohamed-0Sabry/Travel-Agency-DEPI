import React from 'react';
import { cn } from '@/utils/cnhelper';
import type { ButtonProps } from '@/types/ui/button.interface';

export const Button: React.FC<ButtonProps> = ({
  className,
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  type = 'button',
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-green-darker focus:ring-primary',
    secondary: 'bg-light-gray text-text hover:bg-gray-200 focus:ring-gray-400',
    clear: 'bg-transparent text-link hover:bg-blue-50 focus:ring-blue-100',
  }[variant];

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }[size];

  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(baseClasses, variantClasses, sizeClasses, className)}
      disabled={disabled || isLoading}
    >
      {isLoading && (
        <svg
          className="animate-spin mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;
