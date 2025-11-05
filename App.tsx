
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import HomePage from './components/HomePage';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import Header from './components/Header';
import Footer from './components/Footer';
import AlcoholDetailPage from './components/AlcoholDetailPage';
import RankingsPage from './components/RankingsPage';
import CollectionsPage from './components/CollectionsPage';
import CollectionDetailPage from './components/CollectionDetailPage';
import GuidesPage from './components/GuidesPage';
import GuideDetailPage from './components/GuideDetailPage';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import { ReviewsProvider } from './contexts/ReviewsContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import FavoritesPage from './components/FavoritesPage';
import { AnimatePresence } from 'framer-motion';
import SignUpPrompt from './components/SignUpPrompt';
import NewsPage from './components/NewsPage';

const AppRoutes: React.FC = () => {
    const { user } = useAuthContext();
    const location = useLocation();
    
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomePage />} />
                <Route path="/alcohol/:id" element={<AlcoholDetailPage />} />
                <Route path="/rankings" element={<RankingsPage />} />
                <Route path="/collections" element={<CollectionsPage />} />
                <Route path="/collections/:slug" element={<CollectionDetailPage />} />
                <Route path="/guides" element={<GuidesPage />} />
                <Route path="/guides/:slug" element={<GuideDetailPage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/signin" element={user ? <Navigate to="/" /> : <SignInPage />} />
                <Route path="/signup" element={user ? <Navigate to="/" /> : <SignUpPage />} />
            </Routes>
        </AnimatePresence>
    );
};

const MainLayout: React.FC = () => {
    const { user } = useAuthContext();
    const [isSignUpPromptOpen, setIsSignUpPromptOpen] = useState(false);

    useEffect(() => {
        const hasSkippedPrompt = localStorage.getItem('hasSkippedSignUpPrompt');
        if (!user && !hasSkippedPrompt) {
            const timer = setTimeout(() => setIsSignUpPromptOpen(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [user]);

    return (
        <div className="flex flex-col min-h-screen bg-brand-dark">
            <Header />
            <main className="flex-grow">
                <AppRoutes />
            </main>
            <Footer />
            <AnimatePresence>
                {isSignUpPromptOpen && <SignUpPrompt onClose={() => setIsSignUpPromptOpen(false)} />}
            </AnimatePresence>
        </div>
    );
}

const App: React.FC = () => {
  return (
    <AuthProvider>
        <ReviewsProvider>
            <FavoritesProvider>
                <HashRouter>
                    <MainLayout />
                </HashRouter>
            </FavoritesProvider>
        </ReviewsProvider>
    </AuthProvider>
  );
};

export default App;