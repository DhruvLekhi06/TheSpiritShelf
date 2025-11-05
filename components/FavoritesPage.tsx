


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFavoritesContext } from '../contexts/FavoritesContext';
import { ALCOHOL_DATA } from '../constants';
import AlcoholCard from './AlcoholCard';
import { pageVariants, pageTransition, staggerContainer, fadeInUpItem } from '../animations';
import { Alcohol } from '../types';
import QuickViewModal from './common/QuickViewModal';

const FavoritesPage: React.FC = () => {
    const { favorites } = useFavoritesContext();
    const [quickViewAlcohol, setQuickViewAlcohol] = useState<Alcohol | null>(null);

    const favoriteAlcohols = ALCOHOL_DATA.filter(alcohol => favorites.includes(alcohol.id));
    
    useEffect(() => {
        const htmlEl = document.documentElement;
        const bodyEl = document.body;
        if (quickViewAlcohol) {
            htmlEl.style.overflow = 'hidden';
            bodyEl.style.overflow = 'hidden';
        } else {
            htmlEl.style.overflow = '';
            bodyEl.style.overflow = '';
        }
        return () => {
            htmlEl.style.overflow = '';
            bodyEl.style.overflow = '';
        };
    }, [quickViewAlcohol]);

    return (
        <motion.div
            className="container mx-auto px-6 py-12 min-h-[calc(100vh-200px)]"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
        >
            <div className="text-center mb-12">
                <h1 className="text-5xl font-serif font-bold tracking-tight text-white">Your Favorites</h1>
                <p className="mt-4 text-lg max-w-2xl mx-auto text-gray-300">
                    A personal collection of the spirits you love.
                </p>
            </div>

            {favoriteAlcohols.length > 0 ? (
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                >
                    {favoriteAlcohols.map(alcohol => (
                        <motion.div key={alcohol.id} variants={fadeInUpItem}>
                            <AlcoholCard alcohol={alcohol} onQuickViewClick={setQuickViewAlcohol} />
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center py-20 bg-brand-surface border border-brand-outline rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-brand-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <h2 className="text-3xl font-serif text-brand-light mt-6">Your shelf is empty</h2>
                    <p className="text-brand-muted mt-2 max-w-md">
                        Explore our collection and tap the heart icon on any spirit to add it to your favorites.
                    </p>
                    <Link
                        to="/"
                        className="mt-8 inline-block px-8 py-3 font-bold rounded-lg transition-all duration-300 bg-brand-accent text-brand-dark hover:bg-brand-accent-hover hover:-translate-y-px"
                    >
                        Start Exploring
                    </Link>
                </div>
            )}
            <QuickViewModal
                alcohol={quickViewAlcohol}
                onClose={() => setQuickViewAlcohol(null)}
            />
        </motion.div>
    );
};

export default FavoritesPage;
