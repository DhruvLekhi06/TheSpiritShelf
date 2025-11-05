import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, wrap } from 'framer-motion';
import { COLLECTIONS_DATA } from '../constants';

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    };
  }
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

const HeroCarousel: React.FC = () => {
  const [[page, direction], setPage] = useState([0, 0]);

  const collectionIndex = wrap(0, COLLECTIONS_DATA.length, page);
  const collection = COLLECTIONS_DATA[collectionIndex];

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  useEffect(() => {
    const timer = setTimeout(() => paginate(1), 7000); // Auto-play every 7 seconds
    return () => clearTimeout(timer);
  }, [page]);

  const goToSlide = (slideIndex: number) => {
    const newDirection = slideIndex > collectionIndex ? 1 : -1;
    setPage([slideIndex, newDirection]);
  }

  return (
    <div className="relative h-[70vh] md:h-[80vh] w-full flex items-center justify-center overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${collection.imageUrl})` }}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-brand-dark bg-opacity-60 backdrop-blur-sm"></div>

      <div className="relative z-10 text-center text-white px-6">
          <motion.h1 
            key={`${collection.id}-title`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.8, ease: 'easeOut'} }}
            className="text-5xl md:text-7xl font-serif font-bold tracking-tight"
          >
            {collection.title}
          </motion.h1>
          <motion.p 
             key={`${collection.id}-desc`}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.8, ease: 'easeOut'} }}
            className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-brand-light/90"
          >
            {collection.description}
          </motion.p>
          <motion.div
             key={`${collection.id}-button`}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.8, ease: 'easeOut'} }}
             className="mt-10"
          >
              <Link to={`/collections/${collection.slug}`} className="inline-block px-10 py-4 text-lg font-bold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark hover:-translate-y-px active:translate-y-0 bg-brand-accent text-brand-dark hover:bg-brand-accent-hover focus:ring-brand-accent hover:shadow-lg hover:shadow-brand-accent/20 no-underline">
                  Explore Collection
              </Link>
          </motion.div>
      </div>
      
      {/* Navigation Arrows */}
      <button
        className="absolute top-1/2 left-4 z-20 -translate-y-1/2 p-2 rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
        onClick={() => paginate(-1)}
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button
        className="absolute top-1/2 right-4 z-20 -translate-y-1/2 p-2 rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
        onClick={() => paginate(1)}
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
      
      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 flex space-x-3">
          {COLLECTIONS_DATA.map((_, index) => (
              <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === collectionIndex ? 'bg-brand-accent scale-125' : 'bg-white/30 hover:bg-white/50'}`}
                  aria-label={`Go to slide ${index + 1}`}
              />
          ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
