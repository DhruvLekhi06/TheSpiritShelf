import { useState, useEffect } from 'react';
import { User } from '../types';

const ALL_USERS_STORAGE_KEY = 'spirit-shelf-all-users';
const CURRENT_USER_STORAGE_KEY = 'spirit-shelf-user';

export interface AuthHook {
    user: { email: string } | null;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => void;
}

export const useAuth = (): AuthHook => {
    const [user, setUser] = useState<{ email: string } | null>(null);
    const [allUsers, setAllUsers] = useState<User[]>(() => {
        try {
            const storedUsers = localStorage.getItem(ALL_USERS_STORAGE_KEY);
            return storedUsers ? JSON.parse(storedUsers) : [];
        } catch (error) {
            console.error('Failed to parse all users from localStorage', error);
            return [];
        }
    });

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error('Failed to parse user from localStorage', error);
            localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
        }
    }, []);
    
    const saveAllUsers = (users: User[]) => {
        setAllUsers(users);
        localStorage.setItem(ALL_USERS_STORAGE_KEY, JSON.stringify(users));
    }
    
    const logInUser = (userToLogin: User) => {
        const sessionUser = { email: userToLogin.email };
        setUser(sessionUser);
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(sessionUser));
    };

    const signIn = (email: string, password: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => { // Simulate network delay
                const foundUser = allUsers.find(u => u.email === email);
                if (foundUser && foundUser.provider === 'password' && foundUser.password === password) {
                    logInUser(foundUser);
                    resolve();
                } else if (foundUser && foundUser.provider === 'google') {
                    reject(new Error('This account was created using Google. Please use "Sign in with Google".'));
                }
                else {
                    reject(new Error('Invalid email or password.'));
                }
            }, 500);
        });
    };

    const signUp = (email: string, password: string): Promise<void> => {
         return new Promise((resolve, reject) => {
            setTimeout(() => { // Simulate network delay
                const existingUser = allUsers.find(u => u.email === email);
                if (existingUser) {
                   reject(new Error('An account with this email already exists.'));
                } else {
                    const newUser: User = { email, password, provider: 'password' };
                    saveAllUsers([...allUsers, newUser]);
                    logInUser(newUser);
                    resolve();
                }
            }, 500);
        });
    };
    
    const signInWithGoogle = (): Promise<void> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // This is a simulation. In a real app, this would involve a pop-up and OAuth flow.
                const googleEmail = 'demouser@google.com';
                let user = allUsers.find(u => u.email === googleEmail);

                if (user && user.provider === 'password') {
                    reject(new Error('This email is already registered with a password. Sign in with your password instead.'));
                    return;
                }

                if (!user) {
                    user = { email: googleEmail, provider: 'google' };
                    saveAllUsers([...allUsers, user]);
                }
                
                logInUser(user);
                resolve();

            }, 500);
        });
    };

    const signOut = () => {
        setUser(null);
        localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    };

    return { user, signIn, signUp, signInWithGoogle, signOut };
};