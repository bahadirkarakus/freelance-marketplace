import React from 'react';

const Input = ({ 
  label,
  error,
  type = 'text',
  className = '',
  containerClassName = '',
  required = false,
  ...props 
}) => {
  const baseStyles = "w-full px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2";
  
  const normalStyles = "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500";
  
  const errorStyles = "border-2 border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20 text-gray-900 dark:text-white focus:ring-red-500 focus:border-red-500";
  
  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        type={type}
        className={`${baseStyles} ${error ? errorStyles : normalStyles} ${className}`}
        required={required}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
