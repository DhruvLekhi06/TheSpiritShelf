
import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import { useAuthContext } from '../contexts/AuthContext';
import { useReviewsContext } from '../contexts/ReviewsContext';
import { useFavoritesContext } from '../contexts/FavoritesContext';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants, pageTransition, staggerContainer, fadeInUpItem } from '../animations';
import CocktailAssistant from './AskGemini';
import { useLocationAdjustedAlcoholData } from '../hooks/useLocationAdjustedAlcoholData';
import AlcoholCard from './AlcoholCard';
import AlcoholLabel from './common/AlcoholLabel';

const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
);

const InfoBlock: React.FC<{ icon: React.ReactElement, label: string, value: string | number }> = ({ icon, label, value }) => (
    <div className="bg-brand-surface p-4 rounded-lg border border-brand-outline/50 flex items-center gap-4">
        <div className="text-brand-accent">{icon}</div>
        <div>
            <strong className="block text-brand-muted text-xs uppercase tracking-wider">{label}</strong>
            <span className="text-brand-light font-medium text-base">{value}</span>
        </div>
    </div>
);


const AlcoholDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const alcoholData = useLocationAdjustedAlcoholData();
    const alcohol = alcoholData.find(a => a.id === Number(id));

    const { user } = useAuthContext();
    const { reviews, addReview } = useReviewsContext();
    const { isFavorite, toggleFavorite } = useFavoritesContext();
    const [copied, setCopied] = useState(false);
    const [isSharePopoverOpen, setIsSharePopoverOpen] = useState(false);
    const shareContainerRef = useRef<HTMLDivElement>(null);

    const isFav = alcohol ? isFavorite(alcohol.id) : false;
    
    const productReviews = useMemo(() => {
        return reviews
            .filter(r => r.alcoholId === Number(id))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [reviews, id]);

    const averageRating = useMemo(() => {
        if (!alcohol) return 0;
        if (productReviews.length === 0) return alcohol.rating;
        const sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
        return sum / productReviews.length;
    }, [productReviews, alcohol]);

    const recommendedAlcohols = useMemo(() => {
        if (!alcohol) return [];
    
        return alcoholData
          .filter(a => a.id !== alcohol.id)
          .map(otherAlcohol => {
            let score = 0;
            if (otherAlcohol.type === alcohol.type) score += 10;
            if (otherAlcohol.brand === alcohol.brand) score += 5;
            const commonNotes = otherAlcohol.tastingNotes.filter(note => alcohol.tastingNotes.includes(note));
            score += commonNotes.length;
            return { ...otherAlcohol, score };
          })
          .filter(a => a.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 10); // Get top 10 for scrolling
      }, [alcohol, alcoholData]);
    
    // Hooks for recommendation scroller
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showPrev, setShowPrev] = useState(false);
    const [showNext, setShowNext] = useState(true);

    const checkScrollButtons = useCallback(() => {
        const el = scrollContainerRef.current;
        if (el) {
            const tolerance = 5;
            const isScrollable = el.scrollWidth > el.clientWidth;
            setShowPrev(el.scrollLeft > tolerance);
            setShowNext(isScrollable && el.scrollLeft < el.scrollWidth - el.clientWidth - tolerance);
        } else {
            setShowPrev(false);
            setShowNext(false);
        }
    }, []);
    
    useEffect(() => {
        const el = scrollContainerRef.current;
        if (el) {
            checkScrollButtons();
            const resizeObserver = new ResizeObserver(checkScrollButtons);
            resizeObserver.observe(el);
            const mutationObserver = new MutationObserver(checkScrollButtons);
            mutationObserver.observe(el, { childList: true, subtree: true });

            return () => {
                resizeObserver.unobserve(el);
                mutationObserver.disconnect();
            };
        }
    }, [recommendedAlcohols, checkScrollButtons]);

    const scroll = (direction: 'left' | 'right') => {
        const el = scrollContainerRef.current;
        if (el) {
            const scrollAmount = el.clientWidth * 0.8;
            el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (shareContainerRef.current && !shareContainerRef.current.contains(event.target as Node)) {
                setIsSharePopoverOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCopyLink = async () => {
        if (!alcohol) return;
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
                setIsSharePopoverOpen(false);
            }, 2000);
        } catch (err) {
            console.error('Failed to copy link to clipboard:', err);
            alert('Could not copy link.');
        }
    };

    const handleShareClick = async () => {
        if (!alcohol) return;
        const shareData = {
            title: `The Spirit Shelf: ${alcohol.name}`,
            text: `Check out ${alcohol.name} on The Spirit Shelf!`,
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Share was cancelled or failed', err);
            }
        } else {
            setIsSharePopoverOpen(prev => !prev);
        }
    };

    const handleFavoriteToggle = () => {
        if (!alcohol) return;
        if (!user) {
            navigate('/signin', { state: { from: location }, replace: true });
            return;
        }
        toggleFavorite(alcohol.id);
    };


    if (!alcohol) {
        return (
            <div className="container mx-auto px-6 py-12 text-center">
                <h1 className="text-4xl font-serif">Spirit Not Found</h1>
                <Link to="/" className="text-brand-accent hover:underline mt-4 inline-block">Back to Home</Link>
            </div>
        );
    }
    
    const hasUserReviewed = user ? productReviews.some(r => r.userEmail === user.email) : false;

    return (
        <motion.div 
            className="container mx-auto px-4 sm:px-6 py-12"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
        >
            <div className="mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-brand-muted hover:text-brand-light transition-colors duration-200 group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:-translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Back to Results</span>
                </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
                <div className="lg:col-span-2 flex flex-col items-center justify-start">
                    <div className="relative group w-full aspect-[3/4] shadow-2xl rounded-lg overflow-hidden lg:sticky top-28">
                         <AlcoholLabel name={alcohol.name} type={alcohol.type} brand={alcohol.brand} variant="detail" />
                    </div>
                </div>
                <div className="lg:col-span-3">
                    <span className="text-sm font-semibold uppercase tracking-wider text-brand-accent">{alcohol.type}</span>
                    <div className="flex items-start justify-between gap-4 mt-1">
                        <div className="flex-grow">
                             <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">{alcohol.name}</h1>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                             <button
                                onClick={handleFavoriteToggle}
                                className="p-2.5 rounded-full text-brand-muted hover:bg-brand-surface hover:text-red-500 transition-colors duration-200"
                                aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                            >
                                <HeartIcon className={`w-6 h-6 transition-all ${isFav ? 'fill-red-500 stroke-red-500 text-red-500' : 'stroke-current'}`} />
                            </button>
                            <div ref={shareContainerRef} className="relative">
                                 <button
                                    onClick={handleShareClick}
                                    className="p-2.5 rounded-full text-brand-muted hover:bg-brand-surface hover:text-brand-light transition-colors duration-200"
                                    aria-label={`Share ${alcohol.name}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                                    </svg>
                                </button>
                                 <AnimatePresence>
                                {isSharePopoverOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        transition={{ duration: 0.15, ease: 'easeOut' }}
                                        className="absolute z-10 top-full right-0 mt-2 w-52 bg-brand-surface border border-brand-outline rounded-lg shadow-lg p-2 origin-top-right"
                                    >
                                        <a
                                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${alcohol.name} on The Spirit Shelf! ${window.location.href}`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center w-full px-3 py-2 text-sm text-brand-light hover:bg-brand-outline rounded-md transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.654 4.495 1.932 6.299l-1.04 3.813 3.91-1.032zM12 6.545c-.273 0-.542.106-.744.309l-3.232 3.232c-.015.015-.02.036-.02.056s.005.041.02.056l.878.878c.015.015.036.02.056.02s.041-.005.056-.02l1.488-1.488c.196-.196.512-.196.708 0l2.454 2.454c.196.196.196.512 0 .708l-1.488 1.488c-.015.015-.02.036-.02.056s.005.041.02.056l.878.878c.015.015.036.02.056.02s.041-.005.056-.02l3.232-3.232c.412-.412.412-1.082 0-1.494l-2.454-2.454c-.202-.203-.471-.309-.744-.309z"/>
                                            </svg>
                                            <span className="ml-2">Share on WhatsApp</span>
                                        </a>
                                        <button
                                            onClick={handleCopyLink}
                                            className="flex items-center w-full px-3 py-2 text-sm text-brand-light hover:bg-brand-outline rounded-md transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2-2H9a2 2 0 01-2-2V9z" />
                                                <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h6a2 2 0 00-2-2H5z" />
                                            </svg>
                                            <span className="ml-2">{copied ? 'Copied!' : 'Copy Link'}</span>
                                        </button>
                                    </motion.div>
                                )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                    <p className="text-xl text-brand-muted mt-1">{alcohol.brand}</p>

                    <div className="flex items-center space-x-3 my-4">
                        <div className="flex items-center gap-2 text-brand-accent-light bg-brand-dark/50 px-4 py-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.116 3.986 1.24 5.38c.276 1.202-.998 2.14-2.09 1.528L12 18.631l-4.793 2.84c-1.091.612-2.366-.326-2.09-1.528l1.24-5.38-4.116-3.986c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.006z" clipRule="evenodd" />
                            </svg>
                            <span className="font-bold text-2xl font-sans">{averageRating.toFixed(1)}</span>
                        </div>
                        <span className="text-brand-muted">({productReviews.length} {productReviews.length === 1 ? 'review' : 'reviews'})</span>
                    </div>

                    <p className="text-brand-light/90 text-lg my-6">{alcohol.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 my-6 text-sm">
                        <InfoBlock label="Category" value={alcohol.category} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" /></svg>} />
                        <InfoBlock label="ABV" value={`${alcohol.abv}%`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 10H3L2 22h12l-1-12z" /><path strokeLinecap="round" strokeLinejoin="round" d="M14 10l5-9-4 1-3 7" /></svg>} />
                        <InfoBlock label="Origin" value={alcohol.origin} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.7 9.928l.346 2.144M12 5.75l-.346 2.144m6.355 2.034l-.346 2.144M12 21a9 9 0 100-18 9 9 0 000 18z" /></svg>} />
                        <InfoBlock label="Price" value={`₹${alcohol.price.toLocaleString('en-IN')}`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 8h6m-5 4h4m5 6H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2z" /></svg>} />
                    </div>
                    
                    <div className="my-6">
                        <h4 className="font-semibold text-white text-lg mb-3">Tasting Notes</h4>
                        <div className="flex flex-wrap gap-2">
                            {alcohol.tastingNotes.map(note => (
                                <span key={note} className="bg-brand-surface border border-brand-outline text-brand-light/90 text-xs font-medium px-3 py-1.5 rounded-lg">{note}</span>
                            ))}
                        </div>
                    </div>

                    {alcohol.detailedDescription && (
                        <div className="my-6">
                            <h4 className="font-semibold text-white text-lg mb-3">Expert's Note</h4>
                            <div className="bg-brand-dark/30 p-4 rounded-lg border border-brand-outline">
                                <p className="text-brand-light/90 italic">{alcohol.detailedDescription}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
             <div className="my-16 pt-12 border-t border-brand-outline/50">
                <CocktailAssistant alcohol={alcohol} />
            </div>

            {recommendedAlcohols.length > 0 && (
                <div className="my-16 pt-12 border-t border-brand-outline/50">
                    <h2 className="text-4xl font-serif text-white mb-8 text-center">You Might Also Like</h2>
                    <div className="relative group/carousel">
                        <motion.div
                            ref={scrollContainerRef}
                            onScroll={checkScrollButtons}
                            className="flex overflow-x-auto gap-6 sm:gap-8 snap-x snap-mandatory scroll-smooth no-scrollbar -mx-4 sm:-mx-6 px-4 sm:px-6 py-4"
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            {recommendedAlcohols.map(rec => (
                                <motion.div 
                                    key={rec.id} 
                                    variants={fadeInUpItem}
                                    className="snap-start flex-shrink-0 w-[85%] sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)]"
                                >
                                    <AlcoholCard alcohol={rec} className="h-full" />
                                </motion.div>
                            ))}
                        </motion.div>
                        
                        {/* Navigation Buttons */}
                        <AnimatePresence>
                        {showPrev && (
                            <motion.button
                                onClick={() => scroll('left')}
                                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-brand-dark/50 backdrop-blur-sm rounded-full text-white hover:bg-brand-accent hover:text-brand-dark transition-all opacity-0 group-hover/carousel:opacity-100"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                aria-label="Scroll left"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </motion.button>
                        )}
                        </AnimatePresence>

                        <AnimatePresence>
                        {showNext && (
                            <motion.button
                                onClick={() => scroll('right')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-brand-dark/50 backdrop-blur-sm rounded-full text-white hover:bg-brand-accent hover:text-brand-dark transition-all opacity-0 group-hover/carousel:opacity-100"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                aria-label="Scroll right"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </motion.button>
                        )}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            <div className="mt-16 pt-8 border-t border-brand-outline/50">
                <h2 className="text-4xl font-serif text-white mb-8">Community Reviews</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        {user ? (
                            hasUserReviewed ? (
                                <div className="bg-brand-surface p-6 rounded-lg text-center lg:sticky top-28 border border-brand-outline">
                                    <h3 className="text-xl font-serif text-white">Thanks for your review!</h3>
                                    <p className="text-gray-400 mt-2">You have already shared your thoughts on this spirit.</p>
                                </div>
                            ) : (
                                <ReviewForm alcoholId={alcohol.id} user={user} onSubmit={addReview} />
                            )
                        ) : (
                            <div className="bg-brand-surface p-6 rounded-lg text-center lg:sticky top-28 border border-brand-outline">
                                <h3 className="text-xl font-serif text-white">Want to share your thoughts?</h3>
                                <p className="text-gray-400 mt-2">
                                    <Link to="/signin" className="text-brand-accent hover:underline">Sign in</Link> to leave a review.
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="lg:col-span-2 space-y-6">
                        {productReviews.length > 0 ? (
                            productReviews.map(review => <ReviewCard key={review.id} review={review} />)
                        ) : (
                            <div className="bg-brand-surface p-8 rounded-lg text-center border border-brand-outline">
                                <h3 className="text-xl font-serif text-white">Be the first to review!</h3>
                                <p className="text-gray-400 mt-2">No reviews have been submitted for this spirit yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AlcoholDetailPage;
