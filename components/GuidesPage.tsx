
import React from 'react';
import { Link } from 'react-router-dom';
import { GUIDES_DATA } from '../constants';
import { Guide } from '../types';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition, staggerContainer, fadeInUpItem } from '../animations';


const GuideCard: React.FC<{ guide: Guide }> = ({ guide }) => (
    <motion.div variants={fadeInUpItem}>
        <Link to={`/guides/${guide.slug}`} className="block group bg-brand-surface border border-brand-outline rounded-lg overflow-hidden no-underline hover:border-brand-accent transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-accent/10">
            <div className="overflow-hidden">
                 <img src={guide.imageUrl} alt={guide.title} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-6">
                <h3 className="text-2xl font-serif font-bold text-white group-hover:text-brand-accent transition-colors">{guide.title}</h3>
                <p className="text-gray-400 mt-2 line-clamp-3">{guide.description}</p>
            </div>
        </Link>
    </motion.div>
);


const GuidesPage: React.FC = () => {
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
            <h1 className="text-5xl font-serif font-bold tracking-tight text-white">Spirit Guides</h1>
            <p className="mt-4 text-lg max-w-2xl mx-auto text-gray-300">
                Deepen your knowledge with our expert guides. From understanding distillation to mastering cocktails, become a true connoisseur.
            </p>
        </div>

        <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
        >
            {GUIDES_DATA.map(guide => (
                <GuideCard key={guide.id} guide={guide} />
            ))}
        </motion.div>
    </motion.div>
  );
};

export default GuidesPage;