
import React from 'react';
import { motion } from 'framer-motion';

interface AiBotPeekProps {
  onClick: () => void;
}

const AiBotPeek: React.FC<AiBotPeekProps> = ({ onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className={`
        fixed z-[100] flex items-center justify-center text-brand-light focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark focus-visible:ring-brand-accent-light px-6 py-3 font-semibold text-sm
        /* Mobile: Floating Pill Style shifted up */
        bottom-24 right-4 bg-brand-accent text-brand-dark rounded-full shadow-2xl shadow-brand-accent/30
        /* Desktop: Standard Tab Style anchored to bottom */
        lg:bottom-0 lg:right-6 lg:bg-brand-surface lg:text-brand-light lg:border-t lg:border-l lg:border-r lg:border-brand-outline lg:rounded-t-xl lg:rounded-b-none lg:shadow-2xl lg:shadow-black/40
      `}
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: 'spring', stiffness: 260, damping: 25, delay: 0.5 }}
      whileHover={{ y: -5 }}
      aria-label="Open AI Assistant"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 lg:text-brand-accent text-brand-dark" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
      <span>Ask The Expert</span>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 lg:text-brand-muted text-brand-dark/60" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
      </svg>
    </motion.button>
  );
};

export default AiBotPeek;
