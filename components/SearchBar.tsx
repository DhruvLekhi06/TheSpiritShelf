
import React from 'react';

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const SearchBar: React.FC<SearchBarProps> = (props) => {
    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
            </div>
            <input
                type="search"
                className="w-full bg-gray-800 border-2 border-gray-700 rounded-full px-5 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition"
                placeholder="Search by name, brand, or tasting note..."
                {...props}
            />
        </div>
    );
};

export default SearchBar;
