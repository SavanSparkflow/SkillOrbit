import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 5, totalReviews, showScore = true, size = 'sm' }) => {
  const rounded = Math.round(Number(rating) * 10) / 10;
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className="flex items-center gap-1.5">
      {showScore && (
        <span className="font-bold text-amber-400 text-xs">
          {rounded.toFixed(1)}
        </span>
      )}
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${iconSizes[size]} ${
              star <= Math.round(rounded)
                ? 'fill-amber-400 text-amber-400'
                : 'text-slate-600'
            }`}
          />
        ))}
      </div>
      {totalReviews !== undefined && (
        <span className="text-xs text-slate-400">
          ({totalReviews.toLocaleString()})
        </span>
      )}
    </div>
  );
};

export default RatingStars;
