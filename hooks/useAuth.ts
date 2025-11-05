
import { useState, useEffect } from 'react';
import { User } from '../types';
import { USERS_DATA } from '../constants';

// In a real app, this would be in a secure database.
// For simulation, we can add to it in memory.
let mockUsers = [...USERS_DATA];

export interface AuthHook {
    user: User | null;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => void;
}

export const useAuth = (): AuthHook => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('spirit-shelf-user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error('Failed to parse user from localStorage', error);
            localStorage.removeItem('spirit-shelf-user');
        }
    }, []);

    const signIn = (email: string, password: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => { // Simulate network delay
                const foundUser = mockUsers.find(u => u.email === email && u.password === password);
                if (foundUser) {
                    const userToStore = { email: foundUser.email };
                    setUser(userToStore);
                    localStorage.setItem('spirit-shelf-user', JSON.stringify(userToStore));
                    resolve();
                } else {
                    reject(new Error('Invalid email or password.'));
                }
            }, 500);
        });
    };

    const signUp = (email: string, password: string): Promise<void> => {
         return new Promise((resolve, reject) => {
            setTimeout(() => { // Simulate network delay
                const existingUser = mockUsers.find(u => u.email === email);
                if (existingUser) {
                   reject(new Error('An account with this email already exists.'));
                } else {
                    const newUser = { email, password };
                    mockUsers.push(newUser);
                    const userToStore = { email };
                    setUser(userToStore);
                    localStorage.setItem('spirit-shelf-user', JSON.stringify(userToStore));
                    resolve();
                }
            }, 500);
        });
    };

    const signOut = () => {
        setUser(null);
        localStorage.removeItem('spirit-shelf-user');
    };

    return { user, signIn, signUp, signOut };
};
