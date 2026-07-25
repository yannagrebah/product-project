import { memo, useMemo, useCallback } from 'react';
import { useProducts } from '../hooks/useProducts';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const ProductPagination = memo(function ProductPagination() {
  const { page, limit, total, totalPages, setPage, isLoading } = useProducts();

  const currentPage = Number(page) || 1;
  const numTotalPages = Number(totalPages) || 1;
  const numTotal = Number(total) || 0;
  const numLimit = Number(limit) || 10;

  const handlePrevPage = useCallback(() => {
    setPage(Math.max(1, currentPage - 1));
  }, [currentPage, setPage]);

  const handleNextPage = useCallback(() => {
    setPage(Math.min(numTotalPages, currentPage + 1));
  }, [currentPage, numTotalPages, setPage]);

  const handleFirstPage = useCallback(() => {
    setPage(1);
  }, [setPage]);

  const handleLastPage = useCallback(() => {
    setPage(numTotalPages);
  }, [numTotalPages, setPage]);

  const { startItem, endItem, pageNumbers, startPage, endPage } = useMemo(() => {
    if (numTotal === 0) {
      return { startItem: 0, endItem: 0, pageNumbers: [], startPage: 1, endPage: 1 };
    }

    const start = Math.min((currentPage - 1) * numLimit + 1, numTotal);
    const end = Math.min(currentPage * numLimit, numTotal);

    const pages: number[] = [];
    const maxPagesToShow = 5;
    let computedStartPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const computedEndPage = Math.min(numTotalPages, computedStartPage + maxPagesToShow - 1);

    if (computedEndPage - computedStartPage + 1 < maxPagesToShow) {
      computedStartPage = Math.max(1, computedEndPage - maxPagesToShow + 1);
    }

    for (let i = computedStartPage; i <= computedEndPage; i++) {
      pages.push(i);
    }

    return {
      startItem: start,
      endItem: end,
      pageNumbers: pages,
      startPage: computedStartPage,
      endPage: computedEndPage,
    };
  }, [currentPage, numLimit, numTotal, numTotalPages]);

  if (numTotal === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white/80 backdrop-blur-md border border-zinc-200/80 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in-0 slide-in-from-bottom-3 duration-500">
      {/* Summary Info */}
      <div className="text-2xs text-zinc-500 font-medium">
        Showing <span className="text-zinc-900 font-semibold">{startItem}</span>-
        <span className="text-zinc-900 font-semibold">{endItem}</span> of{' '}
        <span className="text-zinc-900 font-semibold">{numTotal}</span> items
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevPage}
          disabled={currentPage <= 1 || isLoading}
          className="gap-1 px-2.5 text-2xs font-medium border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50"
        >
          <ChevronLeft className="size-3.5" />
          <span className="hidden sm:inline">Prev</span>
        </Button>

        {/* Page Number Steps */}
        <div className="flex items-center gap-1">
          {startPage > 1 && (
            <>
              <Button
                variant={currentPage === 1 ? 'default' : 'ghost'}
                size="icon-sm"
                onClick={handleFirstPage}
                disabled={isLoading}
                className="text-2xs font-medium rounded-xl h-7 w-7 active:scale-95 transition-all duration-200"
              >
                1
              </Button>
              {startPage > 2 && (
                <span className="px-1 text-2xs text-zinc-400 select-none">
                  …
                </span>
              )}
            </>
          )}

          {pageNumbers.map((p) => {
            const isCurrentPage = Number(p) === currentPage;
            return (
              <Button
                key={p}
                variant={isCurrentPage ? 'default' : 'outline'}
                size="icon-sm"
                onClick={() => setPage(p)}
                disabled={isLoading}
                className={`text-2xs font-semibold rounded-xl h-7 w-7 transition-all duration-200 active:scale-95 ${
                  isCurrentPage
                    ? 'bg-zinc-900 text-white font-bold border-transparent shadow-xs scale-105 hover:bg-zinc-800'
                    : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer'
                }`}
              >
                {p}
              </Button>
            );
          })}

          {endPage < numTotalPages && (
            <>
              {endPage < numTotalPages - 1 && (
                <span className="px-1 text-2xs text-zinc-400 select-none">
                  …
                </span>
              )}
              <Button
                variant={currentPage === numTotalPages ? 'default' : 'ghost'}
                size="icon-sm"
                onClick={handleLastPage}
                disabled={isLoading}
                className="text-2xs font-medium rounded-xl h-7 w-7 active:scale-95 transition-all duration-200"
              >
                {numTotalPages}
              </Button>
            </>
          )}
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={currentPage >= numTotalPages || isLoading}
          className="gap-1 px-2.5 text-2xs font-medium border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
});
