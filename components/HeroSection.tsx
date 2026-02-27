import React from 'react';
import { motion } from 'framer-motion';
import Button from './common/Button';

const HeroSection: React.FC = () => {
    
  const handleScrollToCollection = () => {
    document.getElementById('spirit-collection')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative text-white text-center py-32 md:py-48 px-6 bg-cover bg-center bg-no-repeat" style={{backgroundImage: `url('https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=2400&auto=format&fit=crop')`}}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(10,10,10,0.4)_0%,_rgba(10,10,10,0.9)_100%)]"></div>
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold tracking-tight text-shadow-lg" style={{textShadow: '2px 2px 10px rgba(0,0,0,0.5)'}}>Discover Your Signature Spirit.</h1>
        <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-brand-light/90">
          Explore a curated world of fine liquors, from rare single malts to artisanal gins. Your next favorite bottle awaits.
        </p>
        <div className="mt-10">
            <Button onClick={handleScrollToCollection} className="px-8 py-3 text-base sm:px-10 sm:py-4 sm:text-lg">
                Explore the Collection
            </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;