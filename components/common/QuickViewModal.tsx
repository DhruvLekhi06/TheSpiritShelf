
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alcohol } from '../../types';
import StarRating from './StarRating';
import Button from './Button';
import { Link } from 'react-router-dom';
import { useReviewsContext } from '../../contexts/ReviewsContext';

interface QuickViewModalProps {
  alcohol: Alcohol | null;
  onClose: () => void;
}

const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: 20 },
};

const QuickViewModal: React.FC<QuickViewModalProps> = ({ alcohol, onClose }) => {
  const { reviews } = useReviewsContext();

  const averageRating = React.useMemo(() => {
    if (!alcohol) return 0;
    const relevantReviews = reviews.filter(r => r.alcoholId === alcohol.id);
    if (relevantReviews.length === 0) return alcohol.rating;
    const sum = relevantReviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / relevantReviews.length;
  }, [reviews, alcohol]);

  return (
    <AnimatePresence>
      {alcohol && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/70 z-[110] backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              className="relative bg-brand-surface border border-brand-outline rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-2 text-brand-muted hover:text-brand-light transition-colors rounded-full z-10 bg-brand-surface/50"
                    aria-label="Close"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="md:w-1/2 p-6 bg-brand-dark flex items-center justify-center">
                    <img
                        src={alcohol.imageUrl}
                        alt={alcohol.name}
                        className="max-h-96 w-auto object-contain"
                    />
                </div>
              
                <div className="md:w-1/2 p-8 flex flex-col overflow-y-auto">
                    <span className="text-sm font-semibold uppercase tracking-wider text-brand-accent">{alcohol.type}</span>
                    <h2 className="text-4xl font-serif font-bold text-brand-light mt-1">{alcohol.name}</h2>
                    <p className="text-lg text-brand-muted">{alcohol.brand}</p>
                    
                    <div className="flex items-center space-x-3 my-4">
                        <StarRating rating={averageRating} size="md" />
                        <span className="text-gray-400">({reviews.filter(r => r.alcoholId === alcohol.id).length} reviews)</span>
                    </div>

                    <p className="text-3xl font-sans font-bold text-brand-light my-4">₹{alcohol.price.toLocaleString('en-IN')}</p>

                    <p className="text-brand-muted mt-2 text-base flex-grow line-clamp-4">{alcohol.description}</p>
                    
                    <div className="mt-8 pt-6 border-t border-brand-outline">
                         <Link to={`/alcohol/${alcohol.id}`} onClick={onClose}>
                            <Button className="w-full py-3.5 text-base">
                                View Full Details
                            </Button>
                         </Link>
                    </div>
                </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;
