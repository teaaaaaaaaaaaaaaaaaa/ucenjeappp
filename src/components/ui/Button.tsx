import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 shadow-sm';
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-[#2563EB] text-white hover:bg-[#1D4ED8] focus:ring-[#2563EB]/50',
    secondary: 'bg-[#F3F4F6] text-[#111827] hover:bg-[#E5E7EB] focus:ring-[#6B7280]/50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
    outline: 'border border-[#D1D5DB] bg-transparent text-[#111827] hover:bg-[#F9FAFB] focus:ring-[#6B7280]/50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800',
    ghost: 'bg-transparent text-[#111827] hover:bg-[#F3F4F6] focus:ring-[#6B7280]/50 dark:text-gray-300 dark:hover:bg-gray-800',
    success: 'bg-[#10B981] text-white hover:bg-[#059669] focus:ring-[#10B981]/50',
    danger: 'bg-[#EF4444] text-white hover:bg-[#DC2626] focus:ring-[#EF4444]/50',
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 rounded-md',
    md: 'text-sm px-4 py-2 rounded-md',
    lg: 'text-base px-6 py-3 rounded-lg',
  };
  
  // Disabled and loading states
  const stateClasses = (disabled || isLoading) ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:translate-y-[-1px]';
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${stateClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button; 