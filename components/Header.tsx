

import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import Button from './common/Button';
import { useAuthContext } from '../contexts/AuthContext';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const NavLinkItem: React.FC<{ to: string; children: React.ReactNode; className?: string; }> = ({ to, children, className }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => `relative group transition-colors font-medium ${isActive ? 'text-brand-light' : 'text-brand-muted hover:text-brand-light'} ${className}`}
        >
            {children}
            <span className="absolute bottom-[-4px] left-0 h-0.5 bg-brand-accent w-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
             {/* Active Indicator */}
             <AnimatePresence>
             {
                // This is a bit of a hack to get the active state to animate with framer-motion
                // It checks if the link is active and renders a motion.div if it is
                <NavLink to={to} end>
                    {({ isActive }) =>
                        isActive && (
                            <motion.div
                                className="absolute bottom-[-4px] left-0 h-0.5 bg-brand-accent w-full"
                                layoutId="underline"
                                initial={false}
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            />
                        )
                    }
                </NavLink>
             }
             </AnimatePresence>
        </NavLink>
    );
};

const mobileNavContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      ease: 'easeOut'
    }
  }
};

const mobileNavItemVariants = {
  hidden: { opacity: 0, y: -20 },
  show: { opacity: 1, y: 0 }
};

const MobileMenu: React.FC<{ onClose: () => void; user: any; onSignOut: () => void; onNavigate: (path: string) => void }> = ({ onClose, user, onSignOut, onNavigate }) => (
  <motion.div
    initial={{ x: '100%' }}
    animate={{ x: 0 }}
    exit={{ x: '100%' }}
    transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
    className="fixed inset-0 bg-brand-dark/95 backdrop-blur-2xl z-[200] p-6 flex flex-col"
  >
    <div className="flex justify-between items-center mb-12">
      <Link to="/" onClick={onClose} className="text-2xl font-serif font-bold text-brand-light">
        The Spirit Shelf
      </Link>
      <button onClick={onClose} className="p-2 text-brand-muted hover:text-brand-light">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <motion.div 
      variants={mobileNavContainerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center justify-center text-center space-y-8 flex-grow"
    >
      <motion.div variants={mobileNavItemVariants}><NavLinkItem to="/rankings" className="text-3xl font-serif tracking-wide">Rankings</NavLinkItem></motion.div>
      <motion.div variants={mobileNavItemVariants}><NavLinkItem to="/guides" className="text-3xl font-serif tracking-wide">Guides</NavLinkItem></motion.div>
      <motion.div variants={mobileNavItemVariants}><NavLinkItem to="/news" className="text-3xl font-serif tracking-wide">News</NavLinkItem></motion.div>
      <motion.div variants={mobileNavItemVariants}><NavLinkItem to="/favorites" className="text-3xl font-serif tracking-wide">Favorites</NavLinkItem></motion.div>
    </motion.div>

    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
      className="flex flex-col items-center space-y-4 pt-8 pb-8"
    >
      {user ? (
          <>
            <span className="text-brand-muted">Welcome, {user.email.split('@')[0]}</span>
            <Button onClick={onSignOut} variant="secondary" className="w-full max-w-xs py-3">Sign Out</Button>
          </>
        ) : (
          <>
            <Button onClick={() => { onNavigate('/signup'); onClose(); }} className="w-full max-w-xs py-3">Sign Up</Button>
            <Button onClick={() => { onNavigate('/signin'); onClose(); }} variant="secondary" className="w-full max-w-xs py-3">Sign In</Button>
          </>
        )}
    </motion.div>
  </motion.div>
);


const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuthContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  useEffect(() => {
    // Close mobile menu on route change
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className="bg-brand-dark/80 backdrop-blur-lg sticky top-0 z-50 transition-all duration-300">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-2xl font-serif font-bold text-brand-light hover:text-brand-accent transition-colors">
              The Spirit Shelf
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
              <NavLinkItem to="/rankings">Rankings</NavLinkItem>
              <NavLinkItem to="/guides">Guides</NavLinkItem>
              <NavLinkItem to="/news">News</NavLinkItem>
              <NavLinkItem to="/favorites">Favorites</NavLinkItem>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-brand-muted hidden sm:block">Welcome, {user.email.split('@')[0]}</span>
                <Button onClick={handleSignOut} variant="secondary" className="px-5 py-2 text-sm">Sign Out</Button>
              </>
            ) : (
              <>
                <Link to="/signin" className="text-brand-muted hover:text-brand-light transition-colors font-medium">
                  Sign In
                </Link>
                <Button onClick={() => navigate('/signup')} className="px-5 py-2 text-sm">Sign Up</Button>
              </>
            )}
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(true)} className="p-2 text-brand-muted hover:text-brand-light">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
          </div>
        </nav>
        <div className="h-px w-full bg-gradient-to-r from-brand-outline/0 via-brand-outline to-brand-outline/0"></div>
      </header>
      <AnimatePresence>
        {isMenuOpen && <MobileMenu onClose={() => setIsMenuOpen(false)} user={user} onSignOut={handleSignOut} onNavigate={navigate} />}
      </AnimatePresence>
    </>
  );
};

export default Header;
