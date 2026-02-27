import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { COLLECTIONS_DATA } from '../constants';
import AlcoholCard from './AlcoholCard';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition, staggerContainer, fadeInUpItem } from '../animations';
import { useLocationAdjustedAlcoholData } from '../hooks/useLocationAdjustedAlcoholData';
import Pagination from './common/Pagination';

const ITEMS_PER_PAGE = 20;

const CollectionDetailPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const alcoholData = useLocationAdjustedAlcoholData();
    const collection = COLLECTIONS_DATA.find(c => c.slug === slug);
    const [currentPage, setCurrentPage] = useState(1);

    if (!collection) {
        return (
            <div className="container mx-auto px-6 py-12 text-center">
                <h1 className="text-4xl font-serif">Collection Not Found</h1>
                <Link to="/collections" className="text-brand-accent hover:underline mt-4 inline-block">Back to Collections</Link>
            </div>
        );
    }
    
    const collectionAlcohols = alcoholData.filter(alcohol => collection.alcoholIds.includes(alcohol.id));

    const totalPages = Math.ceil(collectionAlcohols.length / ITEMS_PER_PAGE);
    const currentAlcohols = useMemo(() => collectionAlcohols.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    ), [currentPage, collectionAlcohols]);

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
                {currentAlcohols.length > 0 ? (
                    <>
                        <motion.div 
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="show"
                            key={currentPage} // Re-trigger animation on page change
                        >
                            {currentAlcohols.map(alcohol => (
                                 <motion.div key={alcohol.id} variants={fadeInUpItem}>
                                    <AlcoholCard alcohol={alcohol} />
                                 </motion.div>
                            ))}
                        </motion.div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            className="mt-12"
                        />
                    </>
                ) : (
                    <p className="text-gray-400">No spirits found in this collection.</p>
                )}
            </div>
        </motion.div>
    );
};

export default CollectionDetailPage;