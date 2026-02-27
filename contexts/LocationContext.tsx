
import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';

type LocationStatus = 'pending' | 'granted' | 'denied';

interface LocationContextType {
    status: LocationStatus;
    coords: { latitude: number; longitude: number } | null;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [status, setStatus] = useState<LocationStatus>('pending');
    const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            console.warn('Geolocation is not supported by this browser.');
            setStatus('denied');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCoords({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
                setStatus('granted');
            },
            (error) => {
                console.warn(`Geolocation error: ${error.message}`);
                setStatus('denied');
            }
        );
    }, []);

    const value = useMemo(() => ({ status, coords }), [status, coords]);

    return (
        <LocationContext.Provider value={value}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocationContext = () => {
    const context = useContext(LocationContext);
    if (context === undefined) {
        throw new Error('useLocationContext must be used within a LocationProvider');
    }
    return context;
};