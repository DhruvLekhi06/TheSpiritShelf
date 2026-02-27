import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import HomePage from './components/HomePage';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import Header from './components/Header';
import Footer from './components/Footer';
import AlcoholDetailPage from './components/AlcoholDetailPage';
import RankingsPage from './components/RankingsPage';
import GuidesPage from './components/GuidesPage';
import GuideDetailPage from './components/GuideDetailPage';
import { AuthProvider } from './contexts/AuthContext';
import { ReviewsProvider } from './contexts/ReviewsContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { LocationProvider, useLocationContext } from './contexts/LocationContext';
import FavoritesPage from './components/FavoritesPage';
import { AnimatePresence } from 'framer-motion';
import NewsPage from './components/NewsPage';
import AiBotWidget from './components/ai-bot/AiBotWidget';
import ScrollToTop from './components/common/ScrollToTop';

const AppRoutes: React.FC = () => {
    const location = useLocation();
    
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomePage />} />
                <Route path="/alcohol/:id" element={<AlcoholDetailPage />} />
                <Route path="/rankings" element={<RankingsPage />} />
                <Route path="/guides" element={<GuidesPage />} />
                <Route path="/guides/:slug" element={<GuideDetailPage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
                <Route path="/signin" element={<AuthRedirect><SignInPage /></AuthRedirect>} />
                <Route path="/signup" element={<AuthRedirect><SignUpPage /></AuthRedirect>} />
            </Routes>
        </AnimatePresence>
    );
};

// Fix: Changed children type from JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { user } = useAuthContext();
    const location = useLocation();
    return user ? children : <Navigate to="/signin" state={{ from: location }} replace />;
};

// Fix: Changed children type from JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
const AuthRedirect: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { user } = useAuthContext();
    return user ? <Navigate to="/" /> : children;
};

const LoadingScreen: React.FC = () => (
    <div className="fixed inset-0 bg-brand-dark flex flex-col items-center justify-center text-center z-[200]">
        <svg className="animate-spin h-10 w-10 text-brand-accent mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h1 className="text-2xl font-serif text-brand-light">Determining Your Location</h1>
        <p className="text-brand-muted mt-2">Please allow location access for accurate pricing.</p>
    </div>
);

const MainLayout: React.FC = () => {
    const { status } = useLocationContext();

    if (status === 'pending') {
        return <LoadingScreen />;
    }

    return (
        <div className="flex flex-col min-h-screen bg-brand-dark">
            <Header />
            <main className="flex-grow">
                <AppRoutes />
            </main>
            <Footer />
            <AiBotWidget />
        </div>
    );
}

// Re-import useAuthContext to be used in ProtectedRoute and AuthRedirect
import { useAuthContext } from './contexts/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <LocationProvider>
        <ReviewsProvider>
            <FavoritesProvider>
                <HashRouter>
                    <ScrollToTop />
                    <MainLayout />
                </HashRouter>
            </FavoritesProvider>
        </ReviewsProvider>
      </LocationProvider>
    </AuthProvider>
  );
};

export default App;