
import React, { useState, useMemo, useEffect } from 'react';
import { AlcoholType, AlcoholCategory } from '../types';
import { useReviewsContext } from '../contexts/ReviewsContext';
import { Link } from 'react-router-dom';
import CustomSelect, { SelectOption } from './common/CustomSelect';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition, staggerContainer, fadeInUpItem } from '../animations';
import Pagination from './common/Pagination';
import { useLocationAdjustedAlcoholData } from '../hooks/useLocationAdjustedAlcoholData';
import AlcoholLabel from './common/AlcoholLabel';

const ITEMS_PER_PAGE = 20;

const Rank: React.FC<{ rank: number }> = ({ rank }) => {
    const rankClasses: { [key: number]: string } = {
        1: 'bg-gradient-to-br from-brand-accent to-brand-accent-dark text-brand-dark shadow-[0_0_15px_theme(colors.brand-accent.DEFAULT)]',
        2: 'bg-gradient-to-br from-gray-500 to-gray-700 text-brand-light',
        3: 'bg-gradient-to-br from-amber-600 to-amber-800 text-brand-light',
    };
    
    const baseClass = 'flex-shrink-0 flex items-center justify-center font-serif font-bold rounded-lg w-10 h-10 text-xl sm:w-12 sm:h-12 sm:text-2xl';
    const rankClass = rankClasses[rank] || 'text-brand-muted bg-brand-surface border border-brand-outline';

    return (
        <div className={`${baseClass} ${rankClass}`}>
            <span>{rank}</span>
        </div>
    );
};

const RankingCard: React.FC<{ alcohol: any; rank: number; reviewCount: number }> = ({ alcohol, rank, reviewCount }) => {
    return (
        <Link 
            to={`/alcohol/${alcohol.id}`} 
            className="block no-underline group"
        >
            <div className="flex items-center bg-brand-surface/70 border border-brand-outline rounded-xl p-3 sm:p-4 space-x-4 group-hover:border-brand-accent/50 group-hover:bg-brand-surface transition-all duration-300 shadow-lg shadow-black/20">
                <Rank rank={rank} />
                <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-black/20 rounded-md overflow-hidden p-1">
                    <AlcoholLabel name={alcohol.name} type={alcohol.type} brand={alcohol.brand} variant="thumb" className="rounded-sm" />
                </div>
                <div className="flex-grow min-w-0">
                    <p className="text-sm text-brand-muted truncate">{alcohol.brand}</p>
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-brand-light truncate group-hover:text-brand-accent transition-colors">{alcohol.name}</h3>
                </div>
                
                <div className="text-right flex-shrink-0">
                    <div className="flex items-center justify-end space-x-1">
                        <span className="font-bold text-xl text-brand-light">{alcohol.averageRating.toFixed(1)}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-brand-accent"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.116 3.986 1.24 5.38c.276 1.202-.998 2.14-2.09 1.528L12 18.631l-4.793 2.84c-1.091.612-2.366-.326-2.09-1.528l1.24-5.38-4.116-3.986c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.006z" clipRule="evenodd" /></svg>
                    </div>
                    <p className="text-xs text-brand-muted">{reviewCount === 1 ? '1 review' : `${reviewCount} reviews`}</p>
                </div>
            </div>
        </Link>
    );
};

const RankingsPage: React.FC = () => {
    const [selectedType, setSelectedType] = useState<AlcoholType | 'All'>('All');
    const [selectedCategory, setSelectedCategory] = useState<'All' | AlcoholCategory>('All');
    const [currentPage, setCurrentPage] = useState(1);
    const alcoholData = useLocationAdjustedAlcoholData();
    const { reviews } = useReviewsContext();

    const rankedAlcohols = useMemo(() => {
        const alcoholsWithRatings = alcoholData.map(alcohol => {
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
    }, [reviews, alcoholData]);
    
    const displayedRankings = useMemo(() => {
        const categoryFiltered = selectedCategory === 'All'
            ? rankedAlcohols
            : rankedAlcohols.filter(a => a.category === selectedCategory);

        return selectedType === 'All'
            ? categoryFiltered
            : categoryFiltered.filter(a => a.type === selectedType);
    }, [selectedType, selectedCategory, rankedAlcohols]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedType, selectedCategory]);

    const totalPages = Math.ceil(displayedRankings.length / ITEMS_PER_PAGE);
    const currentRankings = useMemo(() => displayedRankings.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    ), [currentPage, displayedRankings]);

    const handleTypeChange = (value: AlcoholType | 'All') => {
        setSelectedType(value);
    };

    const handleCategoryChange = (category: 'All' | AlcoholCategory) => {
        setSelectedCategory(category);
    };

    const selectOptions: SelectOption<AlcoholType | 'All'>[] = [
        { value: 'All', label: 'All Spirit Types' },
        ...Object.values(AlcoholType).map(type => ({
            value: type,
            label: `Best ${type}`
        }))
    ];

    const categoryOptions: ('All' | AlcoholCategory)[] = ['All', AlcoholCategory.Standard, AlcoholCategory.Premium];

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
                
                <div className="flex justify-center items-center flex-col sm:flex-row flex-wrap gap-6 mb-12">
                    <div className="flex justify-center items-center bg-brand-surface p-1.5 rounded-full space-x-1">
                        {categoryOptions.map(category => (
                            <button
                              key={category}
                              onClick={() => handleCategoryChange(category)}
                              className={`px-4 sm:px-5 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
                                selectedCategory === category
                                  ? 'bg-brand-accent/20 text-brand-accent-light'
                                  : 'text-brand-muted hover:text-brand-light'
                              }`}
                            >
                              {category}
                            </button>
                        ))}
                    </div>

                    <div className="relative z-20">
                        <CustomSelect
                            value={selectedType}
                            onChange={handleTypeChange}
                            options={selectOptions}
                            ariaLabel="Select spirit type to rank"
                        />
                    </div>
                </div>

                <motion.div 
                    className="space-y-3 sm:space-y-4 max-w-4xl mx-auto"
                    key={`${selectedType}-${selectedCategory}-${currentPage}`} // Re-trigger animation on change
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
                            <p className="text-brand-muted mt-2">There are no spirits matching your criteria.</p>
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
