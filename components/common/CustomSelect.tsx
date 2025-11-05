import React, { useState, useRef, useEffect } from 'react';

export interface SelectOption<T extends string | number> {
  value: T;
  label: string;
}

interface CustomSelectProps<T extends string | number> {
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}

const CustomSelect = <T extends string | number>({ options, value, onChange, ariaLabel }: CustomSelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: T) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative w-72" ref={dropdownRef}>
      <label id="custom-select-label" className="sr-only">{ariaLabel}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-brand-surface border border-brand-outline text-brand-light font-medium py-3 px-4 rounded-lg flex justify-between items-center transition-colors hover:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-dark"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="custom-select-label"
      >
        <span className="truncate">{selectedOption?.label}</span>
        <svg className={`w-5 h-5 transition-transform duration-300 text-brand-muted ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>

      <div className={`absolute z-50 mt-2 w-full bg-brand-surface border border-brand-outline rounded-lg shadow-lg max-h-60 overflow-y-auto transition-all duration-200 ease-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
          {options.map(option => (
            <button
              key={String(option.value)}
              onClick={() => handleSelect(option.value)}
              className={`w-full text-left px-4 py-3 text-sm transition-colors duration-200 flex items-center justify-between ${value === option.value ? 'font-semibold text-brand-accent bg-brand-accent/10' : 'text-brand-light hover:bg-brand-outline'}`}
              role="option"
              aria-selected={value === option.value}
            >
              {option.label}
              {value === option.value && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-accent" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
      </div>
    </div>
  );
};

export default CustomSelect;