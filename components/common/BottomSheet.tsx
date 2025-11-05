
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  manageScroll?: boolean;
}

const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const sheetVariants = {
  visible: { y: 0 },
  hidden: { y: "100%" },
};

const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, title, children, manageScroll = true }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 z-[90]"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-[100] bg-brand-dark border-t border-brand-outline rounded-t-2xl max-h-[85vh] flex flex-col"
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
          >
            <header className="flex-shrink-0 p-4 flex justify-between items-center border-b border-brand-outline">
                <div className="w-8"></div> {/* Spacer */}
                <h3 className="text-xl font-serif text-brand-light text-center">{title}</h3>
                <button onClick={onClose} className="p-2 text-brand-muted hover:text-brand-light">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </header>
            <div className={`flex-grow ${manageScroll ? 'overflow-y-auto' : 'overflow-hidden'}`}>
                {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;