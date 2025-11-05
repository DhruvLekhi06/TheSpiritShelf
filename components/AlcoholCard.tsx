


import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Alcohol } from '../types';
import { useReviewsContext } from '../contexts/ReviewsContext';
import { useFavoritesContext } from '../contexts/FavoritesContext';

interface AlcoholCardProps {
  alcohol: Alcohol;
  className?: string;
  style?: React.CSSProperties;
  onQuickViewClick: (alcohol: Alcohol) => void;
}

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${className}`}>
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.116 3.986 1.24 5.38c.276 1.202-.998 2.14-2.09 1.528L12 18.631l-4.793 2.84c-1.091.612-2.366-.326-2.09-1.528l1.24-5.38-4.116-3.986c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.006z" clipRule="evenodd" />
    </svg>
);

const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
);


const AlcoholCard: React.FC<AlcoholCardProps> = ({ alcohol, className, style, onQuickViewClick }) => {
  const { reviews } = useReviewsContext();
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const isFav = isFavorite(alcohol.id);

  const averageRating = useMemo(() => {
    const relevantReviews = reviews.filter(r => r.alcoholId === alcohol.id);
    if (relevantReviews.length === 0) return alcohol.rating; // Fallback to expert rating
    const sum = relevantReviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / relevantReviews.length;
  }, [reviews, alcohol.id, alcohol.rating]);
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFavorite(alcohol.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onQuickViewClick(alcohol);
  }

  return (
    <Link to={`/alcohol/${alcohol.id}`} className={`bg-brand-surface rounded-lg overflow-hidden group border border-brand-outline hover:border-brand-accent hover:shadow-lg hover:shadow-brand-accent/10 hover:-translate-y-1 transition-all duration-300 flex flex-col no-underline relative ${className}`} style={style}>
      <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:text-red-500 disabled:text-gray-500 transition-all duration-200"
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
      >
          <HeartIcon className={`w-6 h-6 transition-all ${isFav ? 'fill-red-500 stroke-red-500' : 'stroke-white group-hover:stroke-red-400'}`} />
      </button>

      <div className="relative overflow-hidden p-4 bg-brand-dark">
        <img
          src={alcohol.imageUrl}
          alt={alcohol.name}
          className="w-full h-80 object-contain group-hover:scale-105 transition-transform duration-300"
        />
         <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
                onClick={handleQuickView}
                className="bg-brand-light text-brand-dark font-bold py-3 px-6 rounded-lg hover:bg-white transition-colors hover:scale-105 transform active:scale-100"
            >
                Quick View
            </button>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
            <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-accent">{alcohol.type}</span>
                <h3 className="text-2xl font-serif font-bold text-brand-light mt-1">{alcohol.name}</h3>
                <p className="text-sm text-brand-muted">{alcohol.brand}</p>
            </div>
            <div className="flex items-center space-x-1 text-brand-accent bg-brand-dark/50 px-2 py-1 rounded-full">
                <StarIcon />
                <span className="font-bold text-sm">{averageRating.toFixed(1)}</span>
            </div>
        </div>
        <p className="text-brand-muted mt-3 text-sm flex-grow line-clamp-3">{alcohol.description}</p>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-brand-outline">
          <p className="text-2xl font-sans font-bold text-brand-light">₹{alcohol.price.toLocaleString('en-IN')}</p>
          <span className={`text-xs font-bold uppercase px-3 py-1 rounded-md border ${
              alcohol.category === 'Premium' ? 'border-brand-accent text-brand-accent' : 'border-brand-outline text-brand-muted'
          }`}>
            {alcohol.category}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default AlcoholCard;
