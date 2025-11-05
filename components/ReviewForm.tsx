
import React, { useState } from 'react';
import { User, Review } from '../types';
import Button from './common/Button';
import StarRating from './common/StarRating';
import { TASTING_NOTES_OPTIONS } from '../constants';

interface ReviewFormProps {
    alcoholId: number;
    user: User;
    onSubmit: (review: Omit<Review, 'id' | 'date'>) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ alcoholId, user, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [tags, setTags] = useState<string[]>([]);

    const handleTagToggle = (tag: string) => {
        setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating > 0 && comment) {
            onSubmit({
                alcoholId,
                userEmail: user.email,
                rating,
                comment,
                tags
            });
            setRating(0);
            setComment('');
            setTags([]);
        } else {
            alert('Please provide a rating and a comment.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-900/50 p-6 rounded-lg space-y-6 sticky top-24">
            <h3 className="text-2xl font-serif text-white">Leave a Review</h3>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Your Rating</label>
                <StarRating rating={rating} onRatingChange={setRating} />
            </div>
            <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-300 mb-1">Your Comment</label>
                <textarea
                    id="comment"
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition"
                    placeholder="Share your thoughts..."
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tasting Notes (Optional)</label>
                <div className="flex flex-wrap gap-2">
                    {TASTING_NOTES_OPTIONS.map(note => (
                        <button
                            type="button"
                            key={note}
                            onClick={() => handleTagToggle(note)}
                            className={`text-xs font-bold uppercase px-3 py-1.5 rounded-full transition-colors ${
                                tags.includes(note) 
                                ? 'bg-brand-accent text-brand-dark' 
                                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                            }`}
                        >
                            {note}
                        </button>
                    ))}
                </div>
            </div>
            <Button type="submit" className="w-full justify-center">Submit Review</Button>
        </form>
    );
};

export default ReviewForm;
