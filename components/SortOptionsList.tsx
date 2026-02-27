import React from 'react';

type SortOption = 'rating_desc' | 'popularity_desc' | 'price_asc' | 'price_desc' | 'name_asc';

interface SortOptionsListProps {
  selected: SortOption;
  onChange: (option: SortOption) => void;
}

const options: { value: SortOption, label: string }[] = [
    { value: 'rating_desc', label: 'Rating: High to Low' },
    { value: 'popularity_desc', label: 'Most Popular' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'name_asc', label: 'Alphabetical: A-Z' },
];

const SortOptionsList: React.FC<SortOptionsListProps> = ({ selected, onChange }) => {
  return (
    <div className="p-4 space-y-2">
      {options.map(option => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`w-full text-left p-4 rounded-lg transition-colors flex justify-between items-center ${
            selected === option.value 
              ? 'bg-brand-accent/10 text-brand-accent font-semibold' 
              : 'text-brand-light hover:bg-brand-surface'
          }`}
        >
          <span>{option.label}</span>
          {selected === option.value && (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-accent" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      ))}
    </div>
  );
};

export default SortOptionsList;