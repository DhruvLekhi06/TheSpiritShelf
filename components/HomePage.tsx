
import React, { useMemo, useState } from 'react';
import FilterSidebar from './FilterSidebar';
import AlcoholCard from './AlcoholCard';
import SortDropdown from './SortDropdown';
import SearchBar from './SearchBar';
import { PRICE_BRACKETS } from '../constants';
import { AlcoholType, PriceBracketKey } from '../types';
import { useReviewsContext } from '../contexts/ReviewsContext';
import { useDebounce } from '../hooks/useDebounce';
import HeroSection from './HeroSection';
import { motion } from 'framer-motion';
import { pageVariants, staggerContainer, fadeInUpItem, pageTransition } from '../animations';
import BottomSheet from './common/BottomSheet';
import SortOptionsList from './SortOptionsList';
import { useLocationAdjustedAlcoholData } from '../hooks/useLocationAdjustedAlcoholData';
import Pagination from './common/Pagination';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

type SortOption = 'rating_desc' | 'popularity_desc' | 'price_asc' | 'price_desc' | 'name_asc';

const ITEMS_PER_PAGE = 20;

const HomePage: React.FC = () => {
  const alcoholData = useLocationAdjustedAlcoholData();
  const { reviews } = useReviewsContext();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();

  // Derived state from URL Search Params
  const selectedTypes = (searchParams.getAll('type') as AlcoholType[]) || [];
  const priceBracket = (searchParams.get('priceBracket') as PriceBracketKey) || 'all';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const minAbv = parseInt(searchParams.get('minAbv') || '0', 10);
  const maxAbv = parseInt(searchParams.get('maxAbv') || '100', 10);
  const selectedTastingNotes = searchParams.getAll('note') || [];
  const sortOption = (searchParams.get('sort') as SortOption) || 'rating_desc';
  const searchTerm = searchParams.get('q') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isSortSheetOpen, setIsSortSheetOpen] = useState(false);

  // Local state for search input to allow debouncing
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const debouncedSearchTerm = useDebounce(localSearchTerm, 300);

  // Sync debounced search term with URL
  React.useEffect(() => {
    setSearchParams(prev => {
      if (debouncedSearchTerm) {
        prev.set('q', debouncedSearchTerm);
      } else {
        prev.delete('q');
      }
      prev.set('page', '1'); // Reset to page 1 on search
      return prev;
    }, { replace: true });
  }, [debouncedSearchTerm, setSearchParams]);


  // Filter Handlers
  const handleTypeChange = (type: AlcoholType) => {
    setSearchParams(prev => {
      const types = prev.getAll('type');
      if (types.includes(type)) {
        prev.delete('type');
        types.filter(t => t !== type).forEach(t => prev.append('type', t));
      } else {
        prev.append('type', type);
      }
      prev.set('page', '1');
      return prev;
    });
  };

  const handlePriceBracketChange = (bracket: PriceBracketKey) => {
    setSearchParams(prev => {
      prev.set('priceBracket', bracket);
      prev.set('page', '1');
      return prev;
    });
  };

  const handlePriceRangeInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const { value } = e.target;
    if (/^\d*$/.test(value)) {
       setSearchParams(prev => {
           if (value) prev.set(`${type}Price`, value);
           else prev.delete(`${type}Price`);
           prev.set('page', '1');
           return prev;
       }, { replace: true });
    }
  };

  const handleAbvChange = (value: number, handle: 'min' | 'max') => {
     setSearchParams(prev => {
         const currentMin = parseInt(prev.get('minAbv') || '0');
         const currentMax = parseInt(prev.get('maxAbv') || '100');
         
         if (handle === 'min') {
             const newMin = Math.min(value, currentMax);
             prev.set('minAbv', newMin.toString());
         } else {
             const newMax = Math.max(value, currentMin);
             prev.set('maxAbv', newMax.toString());
         }
         prev.set('page', '1');
         return prev;
     }, { replace: true });
  };

  const handleTastingNoteChange = (note: string) => {
     setSearchParams(prev => {
      const notes = prev.getAll('note');
      if (notes.includes(note)) {
        prev.delete('note');
        notes.filter(n => n !== note).forEach(n => prev.append('note', n));
      } else {
        prev.append('note', note);
      }
      prev.set('page', '1');
      return prev;
    });
  };

  const handleSortChange = (option: SortOption) => {
      setSearchParams(prev => {
          prev.set('sort', option);
          prev.set('page', '1');
          return prev;
      });
      setIsSortSheetOpen(false);
  };

  const handleClearFilters = () => {
    setSearchParams(prev => {
      prev.delete('type');
      prev.delete('priceBracket');
      prev.delete('minPrice');
      prev.delete('maxPrice');
      prev.delete('minAbv');
      prev.delete('maxAbv');
      prev.delete('note');
      prev.delete('q');
      prev.set('page', '1');
      return prev;
    });
    setLocalSearchTerm('');
  };

  const handlePageChange = (page: number) => {
      // Authentication Gate for Page 2+
      if (page > 1 && !user) {
          navigate('/signup', { state: { from: location } });
          return;
      }

      setSearchParams(prev => {
          prev.set('page', page.toString());
          return prev;
      });
  };

  const filteredAndSortedAlcohols = useMemo(() => {
    const alcoholsWithRatings = alcoholData.map(alcohol => {
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
      const abvMatch = alcohol.abv >= minAbv && alcohol.abv <= maxAbv;
      const tastingNoteMatch = selectedTastingNotes.length === 0 || selectedTastingNotes.every(note => alcohol.tastingNotes.includes(note));

      const bracket = PRICE_BRACKETS[priceBracket];
      const minPriceVal = minPrice !== '' ? parseInt(minPrice, 10) : 0;
      const maxPriceVal = maxPrice !== '' ? parseInt(maxPrice, 10) : Infinity;

      const lowerBound = Math.max(bracket.min, minPriceVal);
      const upperBound = Math.min(bracket.max, maxPriceVal);
      
      const priceMatch = alcohol.price >= lowerBound && alcohol.price <= upperBound;

      // Search term filter
      const searchMatch = searchTerm.length === 0 ||
        alcohol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alcohol.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alcohol.tastingNotes.some(note => note.toLowerCase().includes(searchTerm.toLowerCase()));

      return typeMatch && priceMatch && abvMatch && tastingNoteMatch && searchMatch;
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
  }, [alcoholData, reviews, selectedTypes, priceBracket, minPrice, maxPrice, minAbv, maxAbv, selectedTastingNotes, searchTerm, sortOption]);
  
  const totalPages = Math.ceil(filteredAndSortedAlcohols.length / ITEMS_PER_PAGE);
  const currentAlcohols = useMemo(() => filteredAndSortedAlcohols.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
  ), [currentPage, filteredAndSortedAlcohols]);

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <HeroSection />
      
      <div id="spirit-collection" className="container mx-auto px-4 sm:px-6 py-16 pb-32 lg:pb-16">
        <div className="mb-10 space-y-4">
            <h2 className="text-4xl font-serif text-center text-brand-light">Our Spirit Collection</h2>
            <SearchBar value={localSearchTerm} onChange={(e) => setLocalSearchTerm(e.target.value)} />
        </div>

        <div className="flex flex-col lg:flex-row lg:gap-10">
          <div className="hidden lg:block lg:w-72 xl:w-80 flex-shrink-0">
            <FilterSidebar
              selectedTypes={selectedTypes}
              onTypeChange={handleTypeChange}
              selectedPriceBracket={priceBracket}
              onPriceBracketChange={handlePriceBracketChange}
              priceRangeInput={{ min: minPrice, max: maxPrice }}
              onPriceRangeInputChange={handlePriceRangeInputChange}
              abvRange={{ min: minAbv, max: maxAbv }}
              onAbvChange={handleAbvChange}
              selectedTastingNotes={selectedTastingNotes}
              onTastingNoteChange={handleTastingNoteChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          <div className="flex-grow min-w-0">
            <div className="flex justify-between items-center mb-6">
                <p className="text-brand-muted">{filteredAndSortedAlcohols.length} results</p>
                <div className="hidden md:block">
                  <SortDropdown selected={sortOption} onChange={handleSortChange} />
                </div>
            </div>

            {currentAlcohols.length > 0 ? (
              <>
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                  key={currentPage}
                >
                  {currentAlcohols.map(alcohol => (
                    <motion.div key={alcohol.id} variants={fadeInUpItem}>
                      <AlcoholCard alcohol={alcohol} />
                    </motion.div>
                  ))}
                </motion.div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  className="mt-12"
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[40vh] bg-brand-surface border border-brand-outline rounded-lg p-8 text-center">
                  <h2 className="text-3xl font-serif text-brand-light">No Spirits Found</h2>
                  <p className="text-brand-muted mt-2">Try adjusting your filters to find your perfect match.</p>
                  <button onClick={handleClearFilters} className="mt-4 text-brand-accent hover:underline">Clear all filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile-only Floating Dock for Filter/Sort */}
      <div className="lg:hidden fixed bottom-6 left-4 right-4 z-40">
        <div className="flex gap-2 p-2 bg-brand-surface/80 backdrop-blur-xl border border-brand-outline/50 rounded-2xl shadow-2xl shadow-black/50 mx-auto max-w-sm">
          <button
            onClick={() => setIsFilterSheetOpen(true)}
            className="flex-1 flex items-center justify-center py-3 px-4 bg-brand-dark/50 hover:bg-brand-dark rounded-xl font-medium text-brand-light transition-colors group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-brand-muted group-hover:text-brand-accent transition-colors" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            Filters
          </button>
          <div className="w-px bg-brand-outline my-2"></div>
          <button
            onClick={() => setIsSortSheetOpen(true)}
            className="flex-1 flex items-center justify-center py-3 px-4 bg-brand-dark/50 hover:bg-brand-dark rounded-xl font-medium text-brand-light transition-colors group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-brand-muted group-hover:text-brand-accent transition-colors" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
            </svg>
            Sort
          </button>
        </div>
      </div>

      <BottomSheet isOpen={isFilterSheetOpen} onClose={() => setIsFilterSheetOpen(false)} title="Filters">
        <FilterSidebar
            isModal={true}
            onClose={() => setIsFilterSheetOpen(false)}
            selectedTypes={selectedTypes}
            onTypeChange={handleTypeChange}
            selectedPriceBracket={priceBracket}
            onPriceBracketChange={handlePriceBracketChange}
            priceRangeInput={{ min: minPrice, max: maxPrice }}
            onPriceRangeInputChange={handlePriceRangeInputChange}
            abvRange={{ min: minAbv, max: maxAbv }}
            onAbvChange={handleAbvChange}
            selectedTastingNotes={selectedTastingNotes}
            onTastingNoteChange={handleTastingNoteChange}
            onClearFilters={handleClearFilters}
        />
      </BottomSheet>
      
      <BottomSheet isOpen={isSortSheetOpen} onClose={() => setIsSortSheetOpen(false)} title="Sort By">
        <SortOptionsList selected={sortOption} onChange={handleSortChange} />
      </BottomSheet>

    </motion.div>
  );
};

export default HomePage;
