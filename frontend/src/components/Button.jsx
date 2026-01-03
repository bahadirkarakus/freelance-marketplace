import React from 'react';

const Button = ({ 
  variant = 'primary', 
  size = 'md',
  children, 
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white hover:scale-105 focus:ring-blue-500",
    danger: "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white hover:scale-105 focus:ring-red-500",
    success: "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white hover:scale-105 focus:ring-green-500",
    outline: "border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 focus:ring-blue-500",
    ghost: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-gray-500"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded",
    md: "px-6 py-2 rounded-lg",
    lg: "px-8 py-3 text-lg rounded-xl"
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
