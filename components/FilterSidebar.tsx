
import React, { useState } from 'react';
import { AlcoholType, AlcoholCategory } from '../types';
import { TASTING_NOTES_OPTIONS } from '../constants';
import Button from './common/Button';

interface FilterSidebarProps {
  selectedTypes: AlcoholType[];
  onTypeChange: (type: AlcoholType) => void;
  selectedCategories: AlcoholCategory[];
  onCategoryChange: (category: AlcoholCategory) => void;
  priceRange: number;
  onPriceChange: (price: number) => void;
  abvRange: { min: number; max: number };
  onAbvChange: (value: number, handle: 'min' | 'max') => void;
  selectedTastingNotes: string[];
  onTastingNoteChange: (note: string) => void;
  onClearFilters: () => void;
  isModal?: boolean;
  onClose?: () => void;
}

const RangeSlider: React.FC<{
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}> = ({ min, max, step, value, onChange }) => (
    <input 
        type="range" 
        min={min} 
        max={max} 
        step={step} 
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))} 
        className="custom-slider h-2 w-full bg-transparent appearance-none cursor-pointer"
    />
);

const FilterSection: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-brand-outline pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center font-semibold text-lg text-brand-light"
            >
                <span>{title}</span>
                <svg className={`w-5 h-5 transition-transform text-brand-muted ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {isOpen && <div className="space-y-3 mt-4">{children}</div>}
        </div>
    );
};

const StyledCheckbox: React.FC<{ label: string; checked: boolean; onChange: () => void; }> = ({ label, checked, onChange }) => (
    <label className="flex items-center space-x-3 cursor-pointer group">
        <div className="relative">
            <input
                type="checkbox"
                className="sr-only"
                checked={checked}
                onChange={onChange}
            />
            <div className={`w-5 h-5 border-2 rounded-sm group-hover:border-brand-accent transition-colors duration-200 ${checked ? 'bg-brand-accent border-brand-accent' : 'bg-transparent border-brand-outline'}`}>
                {checked && (
                    <svg className="w-full h-full text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>
        </div>
        <span className={`transition-colors duration-200 group-hover:text-brand-light ${checked ? 'text-brand-light font-medium' : 'text-brand-muted'}`}>{label}</span>
    </label>
);

const FilterContent: React.FC<Omit<FilterSidebarProps, 'isModal' | 'onClose'>> = ({
  selectedTypes, onTypeChange,
  selectedCategories, onCategoryChange,
  priceRange, onPriceChange,
  abvRange, onAbvChange,
  selectedTastingNotes, onTastingNoteChange,
}) => (
  <>
    <FilterSection title="Type" defaultOpen={true}>
      {Object.values(AlcoholType).map((type) => (
        <StyledCheckbox key={type} label={type} checked={selectedTypes.includes(type)} onChange={() => onTypeChange(type)} />
      ))}
    </FilterSection>

    <FilterSection title="Category">
      {Object.values(AlcoholCategory).map((category) => (
        <StyledCheckbox key={category} label={category} checked={selectedCategories.includes(category)} onChange={() => onCategoryChange(category)} />
      ))}
    </FilterSection>

    <FilterSection title="Max Price">
      <div className="flex flex-col pt-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-brand-muted">Up to</span>
          <span className="text-lg text-brand-light font-semibold">₹{priceRange.toLocaleString('en-IN')}</span>
        </div>
        <RangeSlider min={0} max={20000} step={500} value={priceRange} onChange={onPriceChange} />
      </div>
    </FilterSection>
    
    <FilterSection title="ABV (%)">
      <div className="pt-2">
          <div className="w-full flex justify-between items-center mb-4">
              <span className="text-base font-medium text-brand-muted">Range:</span>
              <span className="text-base font-medium text-brand-light">{abvRange.min}% - {abvRange.max}%</span>
          </div>
          <div className="space-y-4">
              <div>
                  <label className="text-xs text-brand-muted">Min ABV</label>
                   <RangeSlider min={0} max={100} step={1} value={abvRange.min} onChange={(v) => onAbvChange(v, 'min')} />
              </div>
              <div>
                  <label className="text-xs text-brand-muted">Max ABV</label>
                   <RangeSlider min={0} max={100} step={1} value={abvRange.max} onChange={(v) => onAbvChange(v, 'max')} />
              </div>
          </div>
      </div>
    </FilterSection>
    
    <FilterSection title="Tasting Notes">
      {TASTING_NOTES_OPTIONS.map((note) => (
        <StyledCheckbox key={note} label={note} checked={selectedTastingNotes.includes(note)} onChange={() => onTastingNoteChange(note)} />
      ))}
    </FilterSection>
  </>
);

const FilterSidebar: React.FC<FilterSidebarProps> = (props) => {
  const { onClearFilters, isModal = false } = props;

  if (isModal) {
    // When used inside a modal wrapper, it should only render the filter options.
    // The wrapper (MobileFilterModal) will handle the header, footer, and layout.
    return <FilterContent {...props} />;
  }

  return (
    <aside className="w-full lg:w-72 xl:w-80 p-6 bg-brand-surface border border-brand-outline rounded-xl lg:sticky top-28 h-fit lg:max-h-[calc(100vh-8.5rem)] lg:overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-serif text-brand-light">Filters</h3>
        <button onClick={onClearFilters} className="text-sm font-medium text-brand-muted hover:text-brand-light transition-colors duration-200">
          Clear All
        </button>
      </div>
      <FilterContent {...props} />
    </aside>
  );
};

export default FilterSidebar;
