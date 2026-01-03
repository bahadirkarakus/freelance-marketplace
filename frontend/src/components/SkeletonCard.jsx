import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex justify-between items-start gap-3 mb-3">
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
        
        <div className="mb-3">
          <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        </div>
        
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center mb-3">
          <div className="space-y-2">
            <div className="h-3 w-12 bg-gray-200 dark:bg-gray-600 rounded"></div>
            <div className="h-7 w-24 bg-gray-200 dark:bg-gray-600 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-600 rounded"></div>
            <div className="h-5 w-20 bg-gray-200 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
          <div className="h-5 w-16 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

// Multiple skeleton cards
export const SkeletonGrid = ({ count = 6 }) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

// Simple skeleton for lists
export const SkeletonList = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="animate-pulse bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonCard;
