import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, className }) => {
  if (totalPages <= 1) {
    return null;
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      window.scrollTo(0, 0); // Scroll to top on page change
    }
  };

  const getPageNumbers = (): (number | string)[] => {
    const pageNumbers: (number | string)[] = [];
    const maxPagesToShow = 5;
    const halfPages = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= halfPages + 1) {
        for (let i = 1; i <= maxPagesToShow; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - halfPages) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - (halfPages - 1); i <= currentPage + (halfPages - 1); i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className={`flex items-center justify-center space-x-2 ${className}`} aria-label="Pagination">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 font-medium bg-brand-surface border border-brand-outline rounded-lg text-brand-light disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-outline transition-colors"
      >
        Previous
      </button>

      <div className="hidden md:flex items-center space-x-2">
        {pageNumbers.map((page, index) =>
          typeof page === 'number' ? (
            <button
              key={index}
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 font-medium rounded-lg transition-colors ${
                currentPage === page
                  ? 'bg-brand-accent text-brand-dark border border-brand-accent'
                  : 'bg-brand-surface border border-brand-outline text-brand-light hover:bg-brand-outline'
              }`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="px-2 py-2 text-brand-muted">
              {page}
            </span>
          )
        )}
      </div>
      
       <div className="flex md:hidden items-center space-x-2">
         <span className="px-4 py-2 font-medium bg-brand-surface border border-brand-outline rounded-lg text-brand-light">
            Page {currentPage} of {totalPages}
         </span>
       </div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 font-medium bg-brand-surface border border-brand-outline rounded-lg text-brand-light disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-outline transition-colors"
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;
