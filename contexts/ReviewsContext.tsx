
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Review } from '../types';
import { REVIEWS_DATA } from '../constants';

interface ReviewsContextType {
    reviews: Review[];
    addReview: (review: Omit<Review, 'id' | 'date'>) => void;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const ReviewsProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [reviews, setReviews] = useState<Review[]>(REVIEWS_DATA);

    const addReview = (review: Omit<Review, 'id' | 'date'>) => {
        const newReview: Review = {
            ...review,
            id: reviews.length + 1,
            date: new Date().toISOString(),
        };
        setReviews(prev => [newReview, ...prev]);
    };
    
    return (
        <ReviewsContext.Provider value={{ reviews, addReview }}>
            {children}
        </ReviewsContext.Provider>
    );
};

export const useReviewsContext = () => {
    const context = useContext(ReviewsContext);
    if (context === undefined) {
        throw new Error('useReviewsContext must be used within a ReviewsProvider');
    }
    return context;
};
