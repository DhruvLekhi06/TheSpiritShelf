
import React, { useState } from 'react';
import { AlcoholType, PriceBracketKey } from '../types';
import { TASTING_NOTES_OPTIONS, PRICE_BRACKETS } from '../constants';
import Button from './common/Button';

interface FilterSidebarProps {
  selectedTypes: AlcoholType[];
  onTypeChange: (type: AlcoholType) => void;
  selectedPriceBracket: PriceBracketKey;
  onPriceBracketChange: (bracket: PriceBracketKey) => void;
  priceRangeInput: { min: string; max: string };
  onPriceRangeInputChange: (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => void;
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
        className="custom-slider h-1 w-full bg-brand-outline rounded-full appearance-none cursor-pointer"
        style={{
            background: `linear-gradient(to right, #c0954b 0%, #c0954b ${(value - min) / (max - min) * 100}%, #262626 ${(value - min) / (max - min) * 100}%, #262626 100%)`
        }}
    />
);

const FilterSection: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-brand-outline/50 pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center font-serif text-xl text-brand-light"
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
                className="sr-only peer"
                checked={checked}
                onChange={onChange}
            />
            <div className="w-5 h-5 border-2 rounded-md flex items-center justify-center peer-checked:bg-brand-accent peer-checked:border-brand-accent-dark border-brand-outline group-hover:border-brand-accent transition-all duration-200">
                <svg className={`w-3 h-3 text-brand-dark transition-opacity duration-200 ${checked ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 12 9" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 4.5l3 3 6-6" />
                </svg>
            </div>
        </div>
        <span className={`transition-colors duration-200 group-hover:text-brand-light ${checked ? 'text-brand-light font-medium' : 'text-brand-muted'}`}>{label}</span>
    </label>
);

const StyledRadio: React.FC<{ label: string; checked: boolean; onChange: () => void; }> = ({ label, checked, onChange }) => (
    <label className="flex items-center space-x-3 cursor-pointer group">
        <div className="relative">
            <input
                type="radio"
                name="price-bracket"
                className="sr-only peer"
                checked={checked}
                onChange={onChange}
            />
            <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center peer-checked:border-brand-accent-dark border-brand-outline group-hover:border-brand-accent transition-all duration-200`}>
                <div className={`w-2.5 h-2.5 bg-brand-accent rounded-full transition-transform duration-200 transform ${checked ? 'scale-100' : 'scale-0'}`}></div>
            </div>
        </div>
        <span className={`transition-colors duration-200 group-hover:text-brand-light ${checked ? 'text-brand-light font-medium' : 'text-brand-muted'}`}>{label}</span>
    </label>
);

const FilterContent: React.FC<Omit<FilterSidebarProps, 'isModal' | 'onClose'>> = ({
  selectedTypes, onTypeChange,
  selectedPriceBracket, onPriceBracketChange,
  priceRangeInput, onPriceRangeInputChange,
  abvRange, onAbvChange,
  selectedTastingNotes, onTastingNoteChange,
}) => (
  <>
    <FilterSection title="Type" defaultOpen={true}>
      {Object.values(AlcoholType).map((type) => (
        <StyledCheckbox key={type} label={type} checked={selectedTypes.includes(type)} onChange={() => onTypeChange(type)} />
      ))}
    </FilterSection>

    <FilterSection title="Price Range" defaultOpen={true}>
        {Object.entries(PRICE_BRACKETS).map(([key, { label }]) => (
            <StyledRadio 
              key={key} 
              label={label} 
              checked={selectedPriceBracket === key} 
              onChange={() => onPriceBracketChange(key as PriceBracketKey)} 
            />
        ))}
        <div className="mt-4 pt-4 border-t border-brand-outline/50 flex items-center gap-3">
            <div className="flex-1">
                <label htmlFor="min-price" className="text-xs text-brand-muted block mb-1">Min Price</label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted">₹</span>
                    <input
                        id="min-price"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={priceRangeInput.min}
                        onChange={(e) => onPriceRangeInputChange(e, 'min')}
                        placeholder="0"
                        className="w-full bg-brand-dark/50 border-2 border-brand-outline rounded-lg pl-7 pr-2 py-2 text-brand-light placeholder-brand-muted focus:outline-none focus:ring-0 focus:border-brand-accent transition-all duration-300"
                    />
                </div>
            </div>
            <div className="text-brand-muted mt-5">–</div>
            <div className="flex-1">
                <label htmlFor="max-price" className="text-xs text-brand-muted block mb-1">Max Price</label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted">₹</span>
                    <input
                        id="max-price"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={priceRangeInput.max}
                        onChange={(e) => onPriceRangeInputChange(e, 'max')}
                        placeholder="Any"
                        className="w-full bg-brand-dark/50 border-2 border-brand-outline rounded-lg pl-7 pr-2 py-2 text-brand-light placeholder-brand-muted focus:outline-none focus:ring-0 focus:border-brand-accent transition-all duration-300"
                    />
                </div>
            </div>
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
  const { onClearFilters, isModal = false, onClose } = props;

  if (isModal) {
    // This view is rendered inside the BottomSheet component
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex-grow p-6 overflow-y-auto">
          <FilterContent {...props} />
        </div>
        <footer className="flex-shrink-0 p-4 border-t border-brand-outline flex items-center gap-4 bg-brand-dark z-10">
          <Button onClick={onClearFilters} variant="secondary" className="w-full py-3">Clear All</Button>
          <Button onClick={onClose} className="w-full py-3">Show Results</Button>
        </footer>
      </div>
    );
  }

  return (
    <aside className="w-full lg:w-72 xl:w-80 p-6 bg-brand-surface/70 backdrop-blur-sm border border-brand-outline rounded-xl lg:sticky top-28 h-fit lg:max-h-[calc(100vh-8.5rem)] lg:overflow-y-auto">
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
