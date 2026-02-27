import React, { useState, useMemo } from 'react';
import { User, Review } from '../types';
import Button from './common/Button';
import Slider from './common/Slider';
import { TASTING_NOTES_OPTIONS } from '../constants';

interface ReviewFormProps {
    alcoholId: number;
    user: User;
    onSubmit: (review: Omit<Review, 'id' | 'date'>) => void;
}

const ratingQuestions = {
    priceWorth: "Was it worth the price?",
    aroma: "How was the aroma?",
    taste: "Taste / Palate",
    heavenly: "Does it make you reach heaven while drinking?",
    drinkAgain: "Would you drink it again?",
};

type DetailedRatings = Record<keyof typeof ratingQuestions, number>;

const ReviewForm: React.FC<ReviewFormProps> = ({ alcoholId, user, onSubmit }) => {
    const [detailedRatings, setDetailedRatings] = useState<DetailedRatings>({
        priceWorth: 1,
        aroma: 1,
        taste: 1,
        heavenly: 1,
        drinkAgain: 1,
    });
    const [comment, setComment] = useState('');
    const [tags, setTags] = useState<string[]>([]);

    const handleRatingChange = (question: keyof DetailedRatings, value: number) => {
        setDetailedRatings(prev => ({ ...prev, [question]: value }));
    };
    
    const handleTagToggle = (tag: string) => {
        setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };
    
    const { overallRating, isFormComplete } = useMemo(() => {
        const ratingsArray = Object.values(detailedRatings) as number[];
        const ratedQuestions = ratingsArray.filter(r => r > 0);
        const average = ratedQuestions.length > 0
            ? ratedQuestions.reduce((acc, curr) => acc + curr, 0) / ratedQuestions.length
            : 0;

        const complete = ratedQuestions.length === ratingsArray.length && comment.trim() !== '';

        return {
            overallRating: parseFloat(average.toFixed(1)),
            isFormComplete: complete,
        };
    }, [detailedRatings, comment]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormComplete) {
            onSubmit({
                alcoholId,
                userEmail: user.email,
                rating: overallRating,
                comment,
                tags,
                ...detailedRatings
            });
            // Reset form
            setDetailedRatings({ priceWorth: 1, aroma: 1, taste: 1, heavenly: 1, drinkAgain: 1 });
            setComment('');
            setTags([]);
        } else {
            alert('Please fill out all ratings and leave a comment.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-brand-surface/70 backdrop-blur-sm border border-brand-outline p-6 rounded-xl space-y-6 lg:sticky top-28">
            <h3 className="text-2xl font-serif text-white">Leave a Detailed Review</h3>
            
            <div className="space-y-5">
                {Object.entries(ratingQuestions).map(([key, label]) => (
                    <Slider
                        key={key}
                        label={label}
                        min={1}
                        max={5}
                        step={1}
                        value={detailedRatings[key as keyof DetailedRatings]}
                        onChange={(val) => handleRatingChange(key as keyof DetailedRatings, val)}
                    />
                ))}
            </div>

            <div>
                <label htmlFor="comment" className="block text-sm font-medium text-brand-light mb-1">Your Comment</label>
                <textarea
                    id="comment"
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-brand-dark/50 border-2 border-brand-outline rounded-lg px-4 py-3 text-brand-light placeholder-brand-muted focus:outline-none focus:ring-0 focus:border-brand-accent transition-all duration-300"
                    placeholder="Summarize your experience..."
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-brand-light mb-2">Tasting Notes (Optional)</label>
                <div className="flex flex-wrap gap-2">
                    {TASTING_NOTES_OPTIONS.map(note => (
                        <button
                            type="button"
                            key={note}
                            onClick={() => handleTagToggle(note)}
                            className={`text-xs font-bold uppercase px-3 py-1.5 rounded-full transition-colors ${
                                tags.includes(note) 
                                ? 'bg-brand-accent text-brand-dark' 
                                : 'bg-brand-outline hover:bg-brand-outline/50 text-brand-muted hover:text-brand-light'
                            }`}
                        >
                            {note}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="border-t border-brand-outline pt-4 space-y-3">
                 <div className="flex justify-between items-center">
                    <span className="font-semibold text-brand-muted">Overall Rating:</span>
                    <span className="text-2xl font-bold font-serif text-brand-accent">{overallRating > 0 ? overallRating.toFixed(1) : 'N/A'}</span>
                 </div>
                <Button type="submit" className="w-full justify-center" disabled={!isFormComplete}>Submit Review</Button>
            </div>
        </form>
    );
};

export default ReviewForm;