
import React from 'react';
import { motion } from 'framer-motion';
import Button from './common/Button';
import { useNavigate } from 'react-router-dom';

interface SignUpPromptProps {
  onClose: () => void;
}

const SignUpPrompt: React.FC<SignUpPromptProps> = ({ onClose }) => {
  const navigate = useNavigate();

  const handleSkip = () => {
    localStorage.setItem('hasSkippedSignUpPrompt', 'true');
    onClose();
  };

  const handleSignUp = () => {
    localStorage.setItem('hasSkippedSignUpPrompt', 'true'); // Also set on sign up to prevent re-showing
    navigate('/signup');
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 z-[110] flex items-center justify-center p-4">
      <motion.div
        className="relative bg-brand-surface border border-brand-outline rounded-2xl p-8 pt-12 max-w-sm w-full text-center shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <button
            onClick={handleSkip}
            className="absolute top-3 right-3 p-2 text-brand-muted hover:text-brand-light transition-colors rounded-full z-10"
            aria-label="Close"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        <h2 className="text-3xl font-serif text-brand-light mb-2">Join The Shelf</h2>
        <p className="text-brand-muted mb-6">Create an account to save your favorites, leave reviews, and get recommendations.</p>
        
        <div className="flex flex-col gap-3">
          <Button onClick={handleSignUp} className="w-full py-3">Create Account</Button>
          <Button onClick={handleSkip} variant="secondary" className="w-full py-3">Maybe Later</Button>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPrompt;