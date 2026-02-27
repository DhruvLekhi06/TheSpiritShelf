import React, { useState, useRef, useEffect } from 'react';

type SortOption = 'rating_desc' | 'popularity_desc' | 'price_asc' | 'price_desc' | 'name_asc';

interface SortDropdownProps {
  selected: SortOption;
  onChange: (option: SortOption) => void;
  className?: string;
}

const options: { value: SortOption, label: string }[] = [
    { value: 'rating_desc', label: 'Rating: High to Low' },
    { value: 'popularity_desc', label: 'Most Popular' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'name_asc', label: 'Alphabetical: A-Z' },
];

const SortDropdown: React.FC<SortDropdownProps> = ({ selected, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find(opt => opt.value === selected)?.label;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: SortOption) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={`relative w-56 ${className}`} ref={dropdownRef}>
      <label id="sort-by-label" className="sr-only">Sort by</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-brand-surface border border-brand-outline text-brand-light font-medium py-2.5 px-4 rounded-lg flex justify-between items-center transition-colors hover:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-dark"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="sort-by-label"
      >
        <span>{selectedLabel}</span>
        <svg className={`w-5 h-5 transition-transform text-brand-muted ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>

      {isOpen && (
        <div
          className="absolute z-10 mt-2 w-full bg-brand-surface border border-brand-outline rounded-lg shadow-lg"
          role="listbox"
        >
          {options.map(option => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${selected === option.value ? 'font-semibold text-brand-accent bg-brand-accent/10' : 'text-brand-light hover:bg-brand-outline'}`}
              role="option"
              aria-selected={selected === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;