import React, { useState, useRef, useEffect } from 'react';

export interface SelectOption<T extends string | number> {
  value: T;
  label: string;
}

interface CustomSelectProps<T extends string | number> {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  ariaLabel: string;
  className?: string;
}

const CustomSelect = <T extends string | number>({ value, onChange, options, ariaLabel, className }: CustomSelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(opt => opt.value === value);
  const selectedLabel = selectedOption ? selectedOption.label : 'Select...';

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
    <div className={`relative w-56 ${className}`} ref={dropdownRef}>
      <label id="custom-select-label" className="sr-only">{ariaLabel}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-brand-surface border border-brand-outline text-brand-light font-medium py-2.5 px-4 rounded-lg flex justify-between items-center transition-colors hover:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-dark"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="custom-select-label"
      >
        <span className="truncate">{selectedLabel}</span>
        <svg className={`w-5 h-5 transition-transform text-brand-muted flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>

      {isOpen && (
        <div
          className="absolute z-10 mt-2 w-full bg-brand-surface border border-brand-outline rounded-lg shadow-lg max-h-60 overflow-y-auto"
          role="listbox"
        >
          {options.map(option => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${value === option.value ? 'font-semibold text-brand-accent bg-brand-accent/10' : 'text-brand-light hover:bg-brand-outline'}`}
              role="option"
              aria-selected={value === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
