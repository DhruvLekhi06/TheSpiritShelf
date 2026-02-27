
import { useMemo } from 'react';
import { useLocationContext } from '../contexts/LocationContext';
import { ALCOHOL_DATA } from '../constants';
import { Alcohol, AlcoholCategory } from '../types';

// Simple string hash function to get a deterministic number between 0 and 1
const simpleHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    // Make it a predictable pseudo-random number between 0 and 1
    const pseudoRandom = (hash & 0x7FFFFFFF) / 0x7FFFFFFF;
    return pseudoRandom;
};

export const useLocationAdjustedAlcoholData = (): Alcohol[] => {
    const { status, coords } = useLocationContext();

    const adjustedData = useMemo(() => {
        if (status !== 'granted' || !coords) {
            return ALCOHOL_DATA;
        }

        // Create a stable string from coordinates for consistent hashing
        const locationString = `${coords.latitude.toFixed(4)},${coords.longitude.toFixed(4)}`;
        const locationHash = simpleHash(locationString);
        // Create a multiplier between 0.85 and 1.25 for price variation
        const multiplier = 0.85 + (locationHash * 0.40);

        return ALCOHOL_DATA.map(alcohol => {
            // Apply multiplier and round to nearest 10 for cleaner pricing
            const adjustedPrice = Math.round((alcohol.price * multiplier) / 10) * 10;
            const adjustedCategory = adjustedPrice >= 10000 ? AlcoholCategory.Premium : AlcoholCategory.Standard;
            
            return {
                ...alcohol,
                price: adjustedPrice,
                category: adjustedCategory,
            };
        });
    }, [status, coords]);

    return adjustedData;
};