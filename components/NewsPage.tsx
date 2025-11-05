import React, { useState, useMemo } from 'react';
import { NEWS_DATA } from '../constants';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition, staggerContainer, fadeInUpItem } from '../animations';
import Pagination from './common/Pagination';
import { NewsArticle } from '../types';

const ITEMS_PER_PAGE = 6;

const NewsCard: React.FC<{ article: NewsArticle }> = ({ article }) => {
    const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <motion.div variants={fadeInUpItem}>
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="block group bg-brand-surface border border-brand-outline rounded-lg no-underline hover:border-brand-accent transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-accent/10 h-full flex flex-col">
                <div className="p-6 flex-grow flex flex-col">
                    <div className="flex justify-between items-center text-xs text-brand-muted mb-2">
                        <span className="font-semibold uppercase tracking-wider">{article.source}</span>
                        <span>{formattedDate}</span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-white group-hover:text-brand-accent transition-colors mb-2">
                        {article.title}
                    </h3>
                    <p className="text-gray-400 text-sm flex-grow line-clamp-3">{article.snippet}</p>
                    <div className="mt-4 text-sm font-semibold text-brand-accent group-hover:text-brand-accent-hover flex items-center">
                        Read More
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>
                </div>
            </a>
        </motion.div>
    );
};


const NewsPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    
    const totalPages = Math.ceil(NEWS_DATA.length / ITEMS_PER_PAGE);

    const currentArticles = useMemo(() => NEWS_DATA.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    ), [currentPage]);

    return (
        <motion.div 
            className="container mx-auto px-6 py-12"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
        >
            <div className="text-center mb-12">
                <h1 className="text-5xl font-serif font-bold tracking-tight text-white">Industry News & Updates</h1>
                <p className="mt-4 text-lg max-w-2xl mx-auto text-gray-300">
                    Stay current with the latest stories, trends, and breakthroughs from the world of spirits, curated for the connoisseur.
                </p>
            </div>

            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                key={currentPage} // Re-trigger animation on page change
            >
                {currentArticles.map(article => (
                    <NewsCard key={article.id} article={article} />
                ))}
            </motion.div>
            
            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                className="mt-12"
            />
        </motion.div>
    );
};

export default NewsPage;
