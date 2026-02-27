import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import AiBotWindow from './AiBotWindow';
import AiBotPeek from './AiBotPeek';

const AiBotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasBeenWelcomed = sessionStorage.getItem('botWelcomed');
    if (!hasBeenWelcomed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('botWelcomed', 'true');
      }, 500); // Wait 0.5 seconds before auto-opening

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <AnimatePresence>
        {!isOpen && <AiBotPeek onClick={() => setIsOpen(true)} />}
      </AnimatePresence>
      <AnimatePresence>
        {isOpen && <AiBotWindow onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </>
  );
};

export default AiBotWidget;