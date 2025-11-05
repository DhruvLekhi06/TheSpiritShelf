
import React from 'react';
import { Link } from 'react-router-dom';
import { COLLECTIONS_DATA } from '../constants';
import { Collection } from '../types';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition, staggerContainer, fadeInUpItem } from '../animations';


const CollectionCard: React.FC<{ collection: Collection }> = ({ collection }) => (
    <motion.div variants={fadeInUpItem}>
        <Link to={`/collections/${collection.slug}`} className="block group relative rounded-lg overflow-hidden no-underline">
            <img src={collection.imageUrl} alt={collection.title} className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-3xl font-serif font-bold text-white">{collection.title}</h3>
                <p className="text-gray-300 mt-1 line-clamp-2">{collection.description}</p>
            </div>
        </Link>
    </motion.div>
);


const CollectionsPage: React.FC = () => {
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
            <h1 className="text-5xl font-serif font-bold tracking-tight text-white">Curated Collections</h1>
            <p className="mt-4 text-lg max-w-2xl mx-auto text-gray-300">
                Explore handcrafted collections of fine spirits, curated by our experts for every occasion and taste.
            </p>
        </div>

        <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
        >
            {COLLECTIONS_DATA.map(collection => (
                <CollectionCard key={collection.id} collection={collection} />
            ))}
        </motion.div>
    </motion.div>
  );
};

export default CollectionsPage;