import React from 'react';
import { Review } from '../types';

interface ReviewCardProps {
  review: Review;
}

const ratingQuestions: Record<keyof Omit<Review, 'id' | 'alcoholId' | 'userEmail' | 'rating' | 'comment' | 'tags' | 'date'>, string> = {
    priceWorth: "Value",
    aroma: "Aroma",
    taste: "Palate",
    heavenly: "Experience",
    drinkAgain: "Drink Again?",
};

const RatingDisplayBar: React.FC<{ rating: number }> = ({ rating }) => {
    const percentage = (rating / 5) * 100;
    return (
        <div className="w-24 h-2 bg-brand-outline rounded-full overflow-hidden">
            <div
                className="h-full bg-gradient-to-r from-brand-accent-dark to-brand-accent-light rounded-full"
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
};

const DetailedRatingRow: React.FC<{ label: string, rating: number }> = ({ label, rating }) => (
    <div className="flex justify-between items-center text-sm gap-4">
        <span className="text-brand-muted flex-shrink-0">{label}</span>
        <div className="flex items-center gap-2">
            <RatingDisplayBar rating={rating} />
            <span className="font-mono font-bold text-brand-light w-6 text-right">{rating}/5</span>
        </div>
    </div>
);

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="bg-brand-surface/70 backdrop-blur-sm border border-brand-outline p-6 rounded-xl">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-white">{review.userEmail.split('@')[0]}</p>
          <p className="text-xs text-brand-muted">{new Date(review.date).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center space-x-1 text-brand-accent-light bg-brand-dark/50 px-3 py-1.5 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.116 3.986 1.24 5.38c.276 1.202-.998 2.14-2.09 1.528L12 18.631l-4.793 2.84c-1.091.612-2.366-.326-2.09-1.528l1.24-5.38-4.116-3.986c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.006z" clipRule="evenodd" /></svg>
            <span className="font-bold text-base">{review.rating.toFixed(1)}</span>
        </div>
      </div>
      
      <p className="text-brand-light/90 my-4 italic">"{review.comment}"</p>
      
      {review.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
            {review.tags.map(tag => (
                <span key={tag} className="bg-brand-outline text-brand-muted text-xs font-semibold px-2.5 py-1 rounded-full">{tag}</span>
            ))}
        </div>
      )}

      <div className="space-y-2 pt-4 border-t border-brand-outline/50">
        <h4 className="text-sm font-semibold text-brand-light mb-2">Detailed Ratings:</h4>
        <DetailedRatingRow label={ratingQuestions.priceWorth} rating={review.priceWorth} />
        <DetailedRatingRow label={ratingQuestions.aroma} rating={review.aroma} />
        <DetailedRatingRow label={ratingQuestions.taste} rating={review.taste} />
        <DetailedRatingRow label={ratingQuestions.heavenly} rating={review.heavenly} />
        <DetailedRatingRow label={ratingQuestions.drinkAgain} rating={review.drinkAgain} />
      </div>

    </div>
  );
};

export default ReviewCard;