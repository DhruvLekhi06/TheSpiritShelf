
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FilterSidebar from '../FilterSidebar';
import Button from './Button';
import { AlcoholType, AlcoholCategory } from '../../types';

interface MobileFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTypes: AlcoholType[];
  onTypeChange: (type: AlcoholType) => void;
  selectedCategories: AlcoholCategory[];
  onCategoryChange: (category: AlcoholCategory) => void;
  priceRange: number;
  onPriceChange: (price: number) => void;
  abvRange: { min: number; max: number };
  onAbvChange: (value: number, handle: 'min' | 'max') => void;
  selectedTastingNotes: string[];
  onTastingNoteChange: (note: string) => void;
  onClearFilters: () => void;
}

const modalVariants = {
  hidden: { opacity: 0, y: '100%' },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: '100%' },
};

const MobileFilterModal: React.FC<MobileFilterModalProps> = (props) => {
  const { isOpen, onClose, onClearFilters } = props;

  const handleClearAndClose = () => {
    onClearFilters();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-brand-dark z-[100] flex flex-col"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
        >
          <header className="flex-shrink-0 p-4 flex justify-between items-center border-b border-brand-outline">
            <button onClick={onClearFilters} className="text-sm font-medium text-brand-muted hover:text-brand-light transition-colors duration-200 px-2">
              Clear All
            </button>
            <h3 className="text-xl font-serif text-brand-light text-center">Filters</h3>
            <button onClick={onClose} className="p-2 text-brand-muted hover:text-brand-light" aria-label="Close filters">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </header>
          
          <div className="flex-grow p-6 overflow-y-auto">
            <FilterSidebar {...props} isModal={true} onClose={onClose} />
          </div>

          <footer className="flex-shrink-0 p-3 border-t border-brand-outline bg-brand-dark/90 backdrop-blur-sm">
            <Button onClick={onClose} className="w-full py-3.5 text-base">Show Results</Button>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileFilterModal;
