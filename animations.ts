import { Variants, Transition } from 'framer-motion';

export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 15,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -15,
  },
};

export const pageTransition: Transition = {
  type: 'tween',
  ease: [0.42, 0, 0.58, 1], // easeInOut
  duration: 0.5,
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

export const fadeInUpItem: Variants = {
  hidden: { y: 20, opacity: 0 },
  show: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    }
  },
};
