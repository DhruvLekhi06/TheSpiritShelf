import React from 'react';
import { Link } from 'react-router-dom';
import { AUTH_PAGE_BACKGROUND_IMAGE_URL } from '../constants';
// Fix: Import Variants type from framer-motion.
import { motion, Variants } from 'framer-motion';

interface AuthLayoutProps {
    title: string;
    subtitleText: string;
    subtitleLinkText: string;
    subtitleLinkTo: string;
    children: React.ReactNode;
}

// Fix: Explicitly typed cardVariants to resolve type error for cubic-bezier 'ease' property.
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitleText, subtitleLinkText, subtitleLinkTo, children }) => {
    return (
        <div className="min-h-[calc(100vh-140px)] w-full flex items-center justify-center p-4">
             {/* Background Image and Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center -z-10"
                style={{ backgroundImage: `url(${AUTH_PAGE_BACKGROUND_IMAGE_URL})` }}
            />
            <div className="absolute inset-0 bg-brand-dark/70 backdrop-blur-lg -z-10" />

            {/* Form Card */}
            <motion.div
                className="relative bg-brand-surface/60 backdrop-blur-2xl border border-brand-outline/50 rounded-2xl w-full max-w-md p-8 sm:p-12 shadow-2xl shadow-black/30"
                variants={cardVariants}
                initial="hidden"
                animate="show"
            >
                <div className="text-center">
                    <h2 className="text-4xl sm:text-5xl font-serif font-bold text-brand-light">
                        {title}
                    </h2>
                    <p className="mt-3 text-brand-muted">
                        {subtitleText}{' '}
                        <Link to={subtitleLinkTo} className="font-medium text-brand-accent hover:text-brand-accent-hover transition-colors underline-offset-4 hover:underline">
                            {subtitleLinkText}
                        </Link>
                    </p>
                </div>
                {children}
            </motion.div>
        </div>
    );
};

export default AuthLayout;
