


import React, { useState, useMemo, useEffect } from 'react';
import FilterSidebar from './FilterSidebar';
import AlcoholCard from './AlcoholCard';
import SortDropdown from './SortDropdown';
import SearchBar from './SearchBar';
import { ALCOHOL_DATA } from '../constants';
import { Alcohol, AlcoholType, AlcoholCategory } from '../types';
import { useReviewsContext } from '../contexts/ReviewsContext';
import { useDebounce } from '../hooks/useDebounce';
import HeroSection from './HeroSection';
import { motion } from 'framer-motion';
import { pageVariants, staggerContainer, fadeInUpItem, pageTransition } from '../animations';
import BottomSheet from './common/BottomSheet';
import SortOptionsList from './SortOptionsList';
import MobileFilterModal from './common/MobileFilterModal';
import QuickViewModal from './common/QuickViewModal';

type SortOption = 'rating_desc' | 'popularity_desc' | 'price_asc' | 'price_desc' | 'name_asc';

const HomePage: React.FC = () => {
  const { reviews } = useReviewsContext();
  const [selectedTypes, setSelectedTypes] = useState<AlcoholType[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<AlcoholCategory[]>([]);
  const [priceRange, setPriceRange] = useState<number>(20000);
  const [abvRange, setAbvRange] = useState({ min: 0, max: 100 });
  const [selectedTastingNotes, setSelectedTastingNotes] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('rating_desc');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isSortSheetOpen, setIsSortSheetOpen] = useState(false);
  const [quickViewAlcohol, setQuickViewAlcohol] = useState<Alcohol | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const htmlEl = document.documentElement;
    const bodyEl = document.body;
    
    if (isFilterSheetOpen || isSortSheetOpen || quickViewAlcohol) {
        htmlEl.style.overflow = 'hidden';
        bodyEl.style.overflow = 'hidden';
    } else {
        htmlEl.style.overflow = '';
        bodyEl.style.overflow = '';
    }

    return () => {
        htmlEl.style.overflow = '';
        bodyEl.style.overflow = '';
    };
  }, [isFilterSheetOpen, isSortSheetOpen, quickViewAlcohol]);

  const handleToggle = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, item: T) => {
    setter(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const handleAbvChange = (value: number, handle: 'min' | 'max') => {
    setAbvRange(prev => {
        if (handle === 'min') {
            const newMin = Math.min(value, prev.max);
            return { ...prev, min: newMin };
        }
        if (handle === 'max') {
            const newMax = Math.max(value, prev.min);
            return { ...prev, max: newMax };
        }
        return prev;
    });
  };
  
  const handleClearFilters = () => {
    setSelectedTypes([]);
    setSelectedCategories([]);
    setPriceRange(20000);
    setAbvRange({ min: 0, max: 100 });
    setSelectedTastingNotes([]);
    setSearchTerm('');
  }

  const filteredAndSortedAlcohols = useMemo(() => {
    const alcoholsWithRatings = ALCOHOL_DATA.map(alcohol => {
        const relevantReviews = reviews.filter(r => r.alcoholId === alcohol.id);
        const reviewCount = relevantReviews.length;
        let averageRating = alcohol.rating;

        if (reviewCount > 0) {
            const sum = relevantReviews.reduce((acc, review) => acc + review.rating, 0);
            averageRating = sum / reviewCount;
        }
        return { ...alcohol, averageRating, reviewCount };
    });

    const filtered = alcoholsWithRatings.filter((alcohol) => {
      // Sidebar filters
      const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(alcohol.type);
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(alcohol.category);
      const priceMatch = alcohol.price <= priceRange;
      const abvMatch = alcohol.abv >= abvRange.min && alcohol.abv <= abvRange.max;
      const tastingNoteMatch = selectedTastingNotes.length === 0 || selectedTastingNotes.every(note => alcohol.tastingNotes.includes(note));

      // Search term filter
      const searchMatch = debouncedSearchTerm.length === 0 ||
        alcohol.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        alcohol.brand.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        alcohol.tastingNotes.some(note => note.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));

      return typeMatch && categoryMatch && priceMatch && abvMatch && tastingNoteMatch && searchMatch;
    });

    return filtered.sort((a, b) => {
        switch (sortOption) {
            case 'rating_desc':
                return b.averageRating - a.averageRating;
            case 'popularity_desc':
                return b.reviewCount - a.reviewCount;
            case 'price_asc':
                return a.price - b.price;
            case 'price_desc':
                return b.price - a.price;
            case 'name_asc':
                return a.name.localeCompare(b.name);
            default:
                return 0;
        }
    });
  }, [selectedTypes, selectedCategories, priceRange, abvRange, selectedTastingNotes, debouncedSearchTerm, sortOption, reviews]);

  const onSortChange = (option: SortOption) => {
    setSortOption(option);
    setIsSortSheetOpen(false); // Close sheet on selection
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <HeroSection />
      
      <div id="spirit-collection" className="container mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8 space-y-4">
            <h2 className="text-4xl font-serif text-center text-brand-light">Our Spirit Collection</h2>
            <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div className="flex flex-col lg:flex-row lg:gap-8">
          <div className="hidden lg:block lg:w-72 xl:w-80 flex-shrink-0">
            <FilterSidebar
              selectedTypes={selectedTypes}
              onTypeChange={(type) => handleToggle(setSelectedTypes, type)}
              selectedCategories={selectedCategories}
              onCategoryChange={(cat) => handleToggle(setSelectedCategories, cat)}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              abvRange={abvRange}
              onAbvChange={handleAbvChange}
              selectedTastingNotes={selectedTastingNotes}
              onTastingNoteChange={(note) => handleToggle(setSelectedTastingNotes, note)}
              onClearFilters={handleClearFilters}
            />
          </div>

          <div className="flex-grow min-w-0">
            <div className="flex justify-between items-center mb-6">
                <p className="text-brand-muted">{filteredAndSortedAlcohols.length} results</p>
                <div className="hidden md:block">
                  <SortDropdown selected={sortOption} onChange={onSortChange} />
                </div>
            </div>

            {filteredAndSortedAlcohols.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8"
                variants={staggerContainer}
                initial="hidden"
                animate="show"
              >
                {filteredAndSortedAlcohols.map(alcohol => (
                  <motion.div key={alcohol.id} variants={fadeInUpItem}>
                    <AlcoholCard alcohol={alcohol} onQuickViewClick={setQuickViewAlcohol} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[40vh] bg-brand-surface border border-brand-outline rounded-lg p-8 text-center">
                  <h2 className="text-3xl font-serif text-brand-light">No Spirits Found</h2>
                  <p className="text-brand-muted mt-2">Try adjusting your filters to find your perfect match.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile-only sticky footer for filter/sort */}
      <div className="lg:hidden sticky bottom-0 z-40 bg-brand-dark/90 backdrop-blur-lg border-t border-brand-outline p-3 flex gap-3 shadow-[0_-4px_15px_rgba(0,0,0,0.2)]">
        <button
          onClick={() => setIsFilterSheetOpen(true)}
          className="flex-1 flex items-center justify-center text-center py-3 px-4 bg-brand-surface rounded-lg font-semibold text-brand-light hover:bg-brand-outline transition-colors shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
          Filters
        </button>
        <button
          onClick={() => setIsSortSheetOpen(true)}
          className="flex-1 flex items-center justify-center text-center py-3 px-4 bg-brand-surface rounded-lg font-semibold text-brand-light hover:bg-brand-outline transition-colors shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
          </svg>
          Sort
        </button>
      </div>

      <MobileFilterModal
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        selectedTypes={selectedTypes}
        onTypeChange={(type) => handleToggle(setSelectedTypes, type)}
        selectedCategories={selectedCategories}
        onCategoryChange={(cat) => handleToggle(setSelectedCategories, cat)}
        priceRange={priceRange}
        onPriceChange={setPriceRange}
        abvRange={abvRange}
        onAbvChange={handleAbvChange}
        selectedTastingNotes={selectedTastingNotes}
        onTastingNoteChange={(note) => handleToggle(setSelectedTastingNotes, note)}
        onClearFilters={handleClearFilters}
      />
      
      <BottomSheet isOpen={isSortSheetOpen} onClose={() => setIsSortSheetOpen(false)} title="Sort By">
        <SortOptionsList selected={sortOption} onChange={onSortChange} />
      </BottomSheet>

      <QuickViewModal
        alcohol={quickViewAlcohol}
        onClose={() => setQuickViewAlcohol(null)}
      />

    </motion.div>
  );
};

export default HomePage;
