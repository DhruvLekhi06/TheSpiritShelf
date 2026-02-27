import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition, staggerContainer, fadeInUpItem } from '../animations';
import { NewsArticle } from '../types';

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

const LoadingSkeletonCard: React.FC = () => (
    <motion.div variants={fadeInUpItem} className="bg-brand-surface border border-brand-outline rounded-lg p-6 h-full flex flex-col animate-pulse">
        <div className="flex justify-between items-center mb-2">
            <div className="h-3 bg-brand-outline rounded w-1/4"></div>
            <div className="h-3 bg-brand-outline rounded w-1/4"></div>
        </div>
        <div className="h-5 bg-brand-outline rounded w-3/4 mb-2"></div>
        <div className="h-5 bg-brand-outline rounded w-1/2 mb-4"></div>
        <div className="space-y-2 flex-grow">
            <div className="h-3 bg-brand-outline rounded w-full"></div>
            <div className="h-3 bg-brand-outline rounded w-full"></div>
            <div className="h-3 bg-brand-outline rounded w-5/6"></div>
        </div>
        <div className="mt-4 h-4 bg-brand-outline rounded w-1/3"></div>
    </motion.div>
);

const stripHtml = (html: string | null): string => {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
};

const RSS_FEEDS = [
    { name: 'The Spirits Business', url: 'https://www.thespiritsbusiness.com/feed/' },
    { name: 'Whisky Advocate', url: 'https://www.whiskyadvocate.com/feed/' },
    { name: 'Wine & Spirits Magazine', url: 'https://www.wineandspiritsmagazine.com/feed' },
    { name: 'BevNET.com', url: 'https://www.bevnet.com/news/spirits/feed' }
];

const NewsPage: React.FC = () => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNews = useCallback(async (isInitialLoad = false) => {
        if (isInitialLoad) {
            setIsLoading(true);
            setError(null);
        }

        const proxyUrl = 'https://api.allorigins.win/raw?url=';

        const fetchPromises = RSS_FEEDS.map(feed =>
            fetch(proxyUrl + encodeURIComponent(feed.url))
                .then(response => {
                    if (!response.ok) throw new Error(`Failed to fetch ${feed.name}`);
                    return response.text();
                })
                .then(xmlText => {
                    const parser = new window.DOMParser();
                    const doc = parser.parseFromString(xmlText, "text/xml");
                    const items = doc.querySelectorAll("item");
                    const feedArticles: NewsArticle[] = [];
                    
                    items.forEach((item, index) => {
                        const title = item.querySelector("title")?.textContent || '';
                        const link = item.querySelector("link")?.textContent || '';
                        const pubDate = item.querySelector("pubDate")?.textContent || new Date().toISOString();
                        const description = item.querySelector("description")?.textContent || '';

                        if (title && link) {
                            feedArticles.push({
                                id: `${feed.name}-${index}`,
                                title,
                                url: link,
                                source: feed.name,
                                date: new Date(pubDate).toISOString(),
                                snippet: stripHtml(description).substring(0, 150) + '...',
                            });
                        }
                    });
                    return feedArticles;
                })
        );

        try {
            const results = await Promise.allSettled(fetchPromises);
            const allArticles = results
                .filter(result => result.status === 'fulfilled' && result.value)
                .flatMap(result => (result as PromiseFulfilledResult<NewsArticle[]>).value);

            if (allArticles.length === 0) {
                 if (isInitialLoad) {
                    setError("Could not fetch news from any source. Please check back later.");
                }
                return;
            }

            const sortedArticles = allArticles
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 12);

            setArticles(sortedArticles);
            if (!isInitialLoad) {
                setError(null);
            }

        } catch (err) {
            console.error("Failed to process news feeds:", err);
            if (isInitialLoad) {
                setError("An error occurred while fetching the latest news. Please try again later.");
            }
        } finally {
            if (isInitialLoad) {
                setIsLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        fetchNews(true); // Initial fetch with loading state

        const intervalId = setInterval(() => {
            fetchNews(false); // Subsequent fetches are silent
        }, 5 * 60 * 1000); // 300000ms = 5 minutes

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [fetchNews]);

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
                <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-white">Industry News & Updates</h1>
                <p className="mt-4 text-lg max-w-2xl mx-auto text-gray-300">
                    Stay current with the latest stories and trends from leading spirits publications, updated in real-time from their news feeds.
                </p>
            </div>

            {isLoading ? (
                 <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                >
                    {Array.from({ length: 6 }).map((_, index) => (
                        <LoadingSkeletonCard key={index} />
                    ))}
                </motion.div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[30vh] bg-brand-surface border border-brand-outline rounded-lg p-8 text-center">
                    <h2 className="text-3xl font-serif text-brand-light">Oops! Something went wrong.</h2>
                    <p className="text-brand-muted mt-2">{error}</p>
                </div>
            ) : (
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                >
                    {articles.map(article => (
                        <NewsCard key={article.id} article={article} />
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
};

export default NewsPage;