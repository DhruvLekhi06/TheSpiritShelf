
import React from 'react';
import { Review } from '../types';
import StarRating from './common/StarRating';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-white">{review.userEmail.split('@')[0]}</p>
          <p className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</p>
        </div>
        <StarRating rating={review.rating} size="sm" />
      </div>
      <p className="text-gray-300 my-4">{review.comment}</p>
      {review.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
            {review.tags.map(tag => (
                <span key={tag} className="bg-gray-700 text-gray-300 text-xs font-semibold px-2.5 py-1 rounded-full">{tag}</span>
            ))}
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
