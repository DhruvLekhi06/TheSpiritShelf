import React, { useState, useMemo, useEffect } from 'react';
import { ALCOHOL_DATA } from '../constants';
import { AlcoholType } from '../types';
import { useReviewsContext } from '../contexts/ReviewsContext';
import { Link } from 'react-router-dom';
import CustomSelect, { SelectOption } from './common/CustomSelect';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition, staggerContainer, fadeInUpItem } from '../animations';
import Pagination from './common/Pagination';

const ITEMS_PER_PAGE = 20;

const Rank: React.FC<{ rank: number }> = ({ rank }) => {
    const rankClasses: { [key: number]: string } = {
        1: 'bg-brand-accent text-brand-dark border-yellow-300',
        2: 'bg-gray-500 text-brand-light border-gray-400',
        3: 'bg-amber-700 text-brand-light border-amber-600',
    };
    
    const baseClass = 'flex-shrink-0 w-12 h-12 flex items-center justify-center font-serif text-2xl font-bold rounded-full border-2';
    const rankClass = rankClasses[rank] || 'text-brand-muted bg-brand-surface border-brand-outline';

    return (
        <div className={`${baseClass} ${rankClass}`}>
            <span>{rank}</span>
        </div>
    );
};

const RankingCard: React.FC<{ alcohol: any; rank: number; reviewCount: number }> = ({ alcohol, rank, reviewCount }) => {
    const placeholderUrl = `https://placehold.co/48x48/1e1e1e/888888/png?text=N/A`;

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        if (e.currentTarget.src !== placeholderUrl) {
            e.currentTarget.onerror = null; // prevent infinite loops
            e.currentTarget.src = placeholderUrl;
        }
    };

    const handleShareClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        const shareData = {
            title: `The Spirit Shelf: ${alcohol.name}`,
            text: `Check out ${alcohol.name} on The Spirit Shelf! It's currently ranked #${rank} by the community.`,
            url: `${window.location.origin}${window.location.pathname}#/alcohol/${alcohol.id}`
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                // This can happen if the user cancels the share. Not a real error.
                console.log('Share was cancelled or failed', err);
            }
        } else {
            // Fallback for browsers that don't support Web Share API
            try {
                await navigator.clipboard.writeText(shareData.url);
                alert('Link copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy link to clipboard:', err);
                alert('Could not copy link.');
            }
        }
    };

    return (
        <Link 
            to={`/alcohol/${alcohol.id}`} 
            className="block no-underline group"
        >
            <div className="flex items-center bg-brand-surface border border-brand-outline rounded-lg p-3 sm:p-4 space-x-4 group-hover:border-brand-accent transition-colors duration-200">
                <Rank rank={rank} />
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-black/20 rounded-md">
                    <img 
                        src={alcohol.imageUrl || placeholderUrl} 
                        alt={alcohol.name} 
                        className="max-w-full max-h-full object-contain"
                        onError={handleImageError}
                    />
                </div>
                <div className="flex-grow min-w-0">
                    <p className="text-sm text-brand-muted truncate">{alcohol.brand}</p>
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-brand-light truncate">{alcohol.name}</h3>
                </div>
                
                <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
                    <div className="text-right">
                        <div className="flex items-center justify-end space-x-1">
                            <span className="font-bold text-xl text-brand-light">{alcohol.averageRating.toFixed(1)}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-brand-accent"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.116 3.986 1.24 5.38c.276 1.202-.998 2.14-2.09 1.528L12 18.631l-4.793 2.84c-1.091.612-2.366-.326-2.09-1.528l1.24-5.38-4.116-3.986c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.006z" clipRule="evenodd" /></svg>
                        </div>
                        <p className="text-xs text-brand-muted">{reviewCount === 1 ? '1 review' : `${reviewCount} reviews`}</p>
                    </div>
                    <button
                        onClick={handleShareClick}
                        className="block p-2.5 rounded-full text-brand-muted hover:bg-brand-outline hover:text-brand-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface focus:ring-brand-accent transition-colors duration-200"
                        aria-label={`Share ${alcohol.name}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                        </svg>
                    </button>
                </div>
            </div>
        </Link>
    );
};

const RankingsPage: React.FC = () => {
    const [selectedType, setSelectedType] = useState<AlcoholType | 'All'>('All');
    const [currentPage, setCurrentPage] = useState(1);
    const { reviews } = useReviewsContext();

    const rankedAlcohols = useMemo(() => {
        const alcoholsWithRatings = ALCOHOL_DATA.map(alcohol => {
            const relevantReviews = reviews.filter(r => r.alcoholId === alcohol.id);
            const reviewCount = relevantReviews.length;
            let averageRating = alcohol.rating; // Fallback to expert rating

            if (reviewCount > 0) {
                const sum = relevantReviews.reduce((acc, review) => acc + review.rating, 0);
                averageRating = sum / reviewCount;
            }

            return { ...alcohol, averageRating, reviewCount };
        });

        return alcoholsWithRatings.sort((a, b) => {
            if (b.averageRating === a.averageRating) {
                return b.reviewCount - a.reviewCount; // Secondary sort by review count
            }
            return b.averageRating - a.averageRating;
        });
    }, [reviews]);
    
    const displayedRankings = useMemo(() => {
        return selectedType === 'All'
            ? rankedAlcohols
            : rankedAlcohols.filter(a => a.type === selectedType);
    }, [selectedType, rankedAlcohols]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedType]);

    const totalPages = Math.ceil(displayedRankings.length / ITEMS_PER_PAGE);
    const currentRankings = useMemo(() => displayedRankings.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    ), [currentPage, displayedRankings]);

    const handleTypeChange = (value: AlcoholType | 'All') => {
        setSelectedType(value);
    };

    const selectOptions: SelectOption<AlcoholType | 'All'>[] = [
        { value: 'All', label: 'All Spirits' },
        ...Object.values(AlcoholType).map(type => ({
            value: type,
            label: `Best ${type}`
        }))
    ];

    return (
        <motion.div 
            className="bg-brand-dark min-h-screen"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
        >
            <div className="container mx-auto px-4 sm:px-6 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-serif font-bold text-brand-light">Top Shelf Rankings</h1>
                    <p className="text-brand-muted mt-4 max-w-2xl mx-auto text-lg">
                        Discover the highest-rated spirits, as judged by our community of connoisseurs.
                    </p>
                </div>

                <div className="relative z-20 flex justify-center mb-12">
                    <CustomSelect
                        value={selectedType}
                        onChange={handleTypeChange}
                        options={selectOptions}
                        ariaLabel="Select spirit type to rank"
                    />
                </div>

                <motion.div 
                    className="space-y-3 sm:space-y-4 max-w-4xl mx-auto"
                    key={`${selectedType}-${currentPage}`} // Re-trigger animation on change
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                >
                    {currentRankings.length > 0 ? currentRankings.map((alcohol, index) => (
                        <motion.div key={alcohol.id} variants={fadeInUpItem}>
                            <RankingCard
                                alcohol={alcohol}
                                rank={index + 1 + (currentPage - 1) * ITEMS_PER_PAGE}
                                reviewCount={alcohol.reviewCount}
                            />
                        </motion.div>
                    )) : (
                         <div className="flex flex-col items-center justify-center h-full min-h-[30vh] bg-brand-surface border border-brand-outline rounded-lg p-8 text-center">
                            <h2 className="text-3xl font-serif text-brand-light">No Spirits Found</h2>
                            <p className="text-brand-muted mt-2">There are no spirits of this type in our database yet.</p>
                        </div>
                    )}
                </motion.div>
                
                {currentRankings.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        className="mt-12"
                    />
                )}
            </div>
        </motion.div>
    );
};

export default RankingsPage;