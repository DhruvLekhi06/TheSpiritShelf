
import React from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

const StarIcon: React.FC<{ filled: boolean; onClick?: () => void; onMouseEnter?: () => void; onMouseLeave?: () => void; className?: string; }> = 
({ filled, onClick, onMouseEnter, onMouseLeave, className = 'w-6 h-6' }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={`${className} ${filled ? 'text-brand-accent' : 'text-gray-600'} ${onClick ? 'cursor-pointer' : ''} transition-colors`}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
    >
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.116 3.986 1.24 5.38c.276 1.202-.998 2.14-2.09 1.528L12 18.631l-4.793 2.84c-1.091.612-2.366-.326-2.09-1.528l1.24-5.38-4.116-3.986c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.006z" clipRule="evenodd" />
    </svg>
);

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange, size = 'md' }) => {
  const [hoverRating, setHoverRating] = React.useState(0);
  
  const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
  }

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          className={sizeClasses[size]}
          filled={(hoverRating || rating) >= star}
          onClick={onRatingChange ? () => onRatingChange(star) : undefined}
          onMouseEnter={onRatingChange ? () => setHoverRating(star) : undefined}
          onMouseLeave={onRatingChange ? () => setHoverRating(0) : undefined}
        />
      ))}
    </div>
  );
};

export default StarRating;
