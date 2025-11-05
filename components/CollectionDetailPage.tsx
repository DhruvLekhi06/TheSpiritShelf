


import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { COLLECTIONS_DATA, ALCOHOL_DATA } from '../constants';
import AlcoholCard from './AlcoholCard';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition, staggerContainer, fadeInUpItem } from '../animations';
import { Alcohol } from '../types';
import QuickViewModal from './common/QuickViewModal';


const CollectionDetailPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const collection = COLLECTIONS_DATA.find(c => c.slug === slug);
    const [quickViewAlcohol, setQuickViewAlcohol] = useState<Alcohol | null>(null);

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


    if (!collection) {
        return (
            <div className="container mx-auto px-6 py-12 text-center">
                <h1 className="text-4xl font-serif">Collection Not Found</h1>
                <Link to="/collections" className="text-brand-accent hover:underline mt-4 inline-block">Back to Collections</Link>
            </div>
        );
    }
    
    const collectionAlcohols = ALCOHOL_DATA.filter(alcohol => collection.alcoholIds.includes(alcohol.id));

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
        >
            <div className="relative text-white text-center py-24 md:py-32 px-6 bg-cover bg-center bg-no-repeat" style={{backgroundImage: `url('${collection.imageUrl}')`}}>
                <div className="absolute inset-0 bg-brand-dark bg-opacity-70"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">{collection.title}</h1>
                    <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-gray-300">
                        {collection.description}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12">
                <h2 className="text-3xl font-serif text-white mb-8">Spirits in this Collection</h2>
                {collectionAlcohols.length > 0 ? (
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="show"
                    >
                        {collectionAlcohols.map(alcohol => (
                             <motion.div key={alcohol.id} variants={fadeInUpItem}>
                                <AlcoholCard alcohol={alcohol} onQuickViewClick={setQuickViewAlcohol} />
                             </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <p className="text-gray-400">No spirits found in this collection.</p>
                )}
            </div>
            <QuickViewModal
                alcohol={quickViewAlcohol}
                onClose={() => setQuickViewAlcohol(null)}
            />
        </motion.div>
    );
};

export default CollectionDetailPage;
