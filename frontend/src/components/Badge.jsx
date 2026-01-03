import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md',
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center font-semibold rounded-full whitespace-nowrap transition-colors duration-200";
  
  const variants = {
    default: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
    primary: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
    success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200",
    warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200",
    danger: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
    info: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-200",
    purple: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200"
  };
  
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-xs",
    lg: "px-4 py-1.5 text-sm"
  };
  
  return (
    <span 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

// Status Badge with predefined colors for common statuses
export const StatusBadge = ({ status, className = '' }) => {
  const statusConfig = {
    open: { variant: 'success', text: 'Open' },
    in_progress: { variant: 'primary', text: 'In Progress' },
    completed: { variant: 'default', text: 'Completed' },
    cancelled: { variant: 'danger', text: 'Cancelled' },
    pending: { variant: 'warning', text: 'Pending' },
    accepted: { variant: 'success', text: 'Accepted' },
    rejected: { variant: 'danger', text: 'Rejected' }
  };
  
  const config = statusConfig[status] || { variant: 'default', text: status };
  
  return (
    <Badge variant={config.variant} className={className}>
      {config.text}
    </Badge>
  );
};

export default Badge;
