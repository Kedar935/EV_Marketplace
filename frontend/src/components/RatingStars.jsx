import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 5, count = 0, size = 'sm', showNumber = true }) => {
  const numRating = Number(rating) || 5;
  const starSize = size === 'lg' ? 'w-5 h-5' : size === 'xs' ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= Math.round(numRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'
            }`}
          />
        ))}
      </div>
      {showNumber && (
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {numRating.toFixed(1)} {count > 0 && <span className="text-slate-400 dark:text-slate-500">({count})</span>}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
