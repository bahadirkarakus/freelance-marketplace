import React from 'react';

/**
 * StarRating Component
 * 5 yıldız gösterimi ve tıklanabilir rating
 * @param {number} value - Mevcut puan (0-5)
 * @param {function} onChange - Puan değiştiğinde çağrılacak fonksiyon
 * @param {boolean} readOnly - Sadece gösterim mi (tıklanamaz)
 * @param {number} size - Yıldız boyutu (px)
 */
const StarRating = ({ value = 0, onChange, readOnly = false, size = 24 }) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  const handleClick = (rating) => {
    if (!readOnly && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating) => {
    if (!readOnly) {
      setHoverRating(rating);
    }
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const displayRating = hoverRating || value;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= displayRating;
        const isPartial = star === Math.ceil(displayRating) && displayRating % 1 !== 0;
        
        return (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={readOnly}
            className={`${
              readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            } transition-transform`}
            aria-label={`${star} star${star !== 1 ? 's' : ''}`}
          >
            {isPartial ? (
              // Yarım yıldız
              <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id={`half-${star}`}>
                    <stop offset="50%" stopColor="#FCD34D" />
                    <stop offset="50%" stopColor="#D1D5DB" />
                  </linearGradient>
                </defs>
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  fill={`url(#half-${star})`}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-yellow-400 dark:text-yellow-500"
                />
              </svg>
            ) : (
              // Tam veya boş yıldız
              <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill={isFilled ? 'currentColor' : 'none'}
                xmlns="http://www.w3.org/2000/svg"
                className={
                  isFilled
                    ? 'text-yellow-400 dark:text-yellow-500'
                    : 'text-gray-300 dark:text-gray-600'
                }
              >
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
            )}
          </button>
        );
      })}
      {value > 0 && (
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
