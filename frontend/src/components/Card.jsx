import React from 'react';

const Card = ({ 
  children, 
  className = '',
  hover = true,
  padding = 'p-6',
  ...props 
}) => {
  const baseStyles = "bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700";
  
  const hoverStyles = hover 
    ? "hover:shadow-xl hover:-translate-y-1 transition-all duration-300" 
    : "transition-shadow duration-200";
  
  return (
    <div 
      className={`${baseStyles} ${hoverStyles} ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-xl font-bold text-gray-900 dark:text-white ${className}`}>
    {children}
  </h3>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 ${className}`}>
    {children}
  </div>
);

export default Card;
