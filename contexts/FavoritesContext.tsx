
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuthContext } from './AuthContext';

interface FavoritesContextType {
    favorites: number[];
    toggleFavorite: (id: number) => void;
    isFavorite: (id: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const getStorageKey = (userEmail: string | null) => userEmail ? `spirit-shelf-favorites-${userEmail}` : 'spirit-shelf-favorites-guest';

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuthContext();
    const [favorites, setFavorites] = useState<number[]>([]);

    useEffect(() => {
        try {
            const storageKey = getStorageKey(user?.email || null);
            const storedFavorites = localStorage.getItem(storageKey);
            if (storedFavorites) {
                setFavorites(JSON.parse(storedFavorites));
            } else {
                setFavorites([]); // Clear favorites when user changes and none are stored
            }
        } catch (error) {
            console.error('Failed to parse favorites from localStorage', error);
            setFavorites([]);
        }
    }, [user]);

    const saveFavorites = (newFavorites: number[]) => {
        try {
            const storageKey = getStorageKey(user?.email || null);
            localStorage.setItem(storageKey, JSON.stringify(newFavorites));
            setFavorites(newFavorites);
        } catch (error) {
            console.error('Failed to save favorites to localStorage', error);
        }
    };

    const toggleFavorite = (id: number) => {
        const isCurrentlyFavorite = favorites.includes(id);
        const newFavorites = isCurrentlyFavorite
            ? favorites.filter(favId => favId !== id)
            : [...favorites, id];
        saveFavorites(newFavorites);
    };

    const isFavorite = useCallback((id: number) => {
        return favorites.includes(id);
    }, [favorites]);

    const value = { favorites, toggleFavorite, isFavorite };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavoritesContext = () => {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavoritesContext must be used within a FavoritesProvider');
    }
    return context;
};
