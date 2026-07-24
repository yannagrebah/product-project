import { memo, useMemo, useCallback } from 'react';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from './ProductCard';
import { ProductListItem } from './ProductListItem';
import { Button } from './ui/button';
import { RefreshCw } from 'lucide-react';

export const ProductGrid = memo(function ProductGrid() {
  const { products, isLoading, error, viewMode, refetch, resetFilters } = useProducts();

  const handleRetry = useCallback(() => {
    void refetch();
  }, [refetch]);

  const productItems = useMemo(() => {
    if (viewMode === 'list') {
      return products.map((product, idx) => (
        <ProductListItem key={product.id} product={product} index={idx} />
      ));
    }
    return products.map((product, idx) => (
      <ProductCard key={product.id} product={product} index={idx} />
    ));
  }, [products, viewMode]);

  // Initial Skeleton Loader State (only when no products are loaded yet)
  if (isLoading && products.length === 0) {
    if (viewMode === 'list') {
      return (
        <div className="flex flex-col gap-3 w-full">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-zinc-200/60 bg-white p-4 flex items-center justify-between gap-4 animate-pulse shadow-2xs"
            >
              <div className="flex items-center gap-4">
                <div className="size-20 rounded-xl bg-zinc-100 shrink-0" />
                <div className="space-y-2">
                  <div className="h-4 w-40 bg-zinc-100 rounded-lg" />
                  <div className="h-3 w-20 bg-zinc-100 rounded-lg" />
                </div>
              </div>
              <div className="h-6 w-16 bg-zinc-100 rounded-lg shrink-0" />
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-zinc-200/60 bg-white p-4 space-y-4 animate-pulse shadow-2xs"
          >
            <div className="w-full aspect-4/3 rounded-xl bg-zinc-100" />
            <div className="h-4 w-3/4 bg-zinc-100 rounded-lg" />
            <div className="h-3 w-1/2 bg-zinc-100 rounded-lg" />
            <div className="h-5 w-1/3 bg-zinc-100 rounded-lg pt-2" />
          </div>
        ))}
      </div>
    );
  }

  // Error State
  if (error && products.length === 0) {
    return (
      <div className="w-full rounded-2xl border border-rose-200 bg-rose-50/50 p-8 text-center space-y-3 my-6 animate-in fade-in-0 zoom-in-95 duration-300">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-zinc-900">
            Unable to load products
          </h3>
          <p className="text-2xs text-zinc-600 max-w-md mx-auto">
            {error}. Please check your backend connection and try again.
          </p>
        </div>
        <Button
          onClick={handleRetry}
          variant="outline"
          size="sm"
          className="gap-2 border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-100 active:scale-95 transition-all duration-200"
        >
          <RefreshCw className="size-3.5" />
          Retry Connection
        </Button>
      </div>
    );
  }

  // Empty State (when search/filters yield zero results and loading is complete)
  if (!isLoading && products.length === 0) {
    return (
      <div className="w-full rounded-2xl border border-zinc-200/80 bg-white p-12 text-center space-y-3 my-6 shadow-2xs animate-in fade-in-0 zoom-in-95 duration-300">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-zinc-900">
            No matching products
          </h3>
          <p className="text-2xs text-zinc-500 max-w-md mx-auto">
            No items matched your search query or filter criteria.
          </p>
        </div>
        <Button
          onClick={resetFilters}
          variant="secondary"
          size="sm"
          className="text-xs hover:bg-zinc-200 active:scale-95 transition-all duration-200"
        >
          Reset Filters
        </Button>
      </div>
    );
  }

  // Active Product Container (Grid or List) with non-disruptive background loading opacity
  const containerClasses = `transition-opacity duration-300 ${
    isLoading ? 'opacity-70 pointer-events-none' : 'opacity-100'
  }`;

  if (viewMode === 'list') {
    return (
      <div className={`flex flex-col gap-3 w-full ${containerClasses}`}>
        {productItems}
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full ${containerClasses}`}
    >
      {productItems}
    </div>
  );
});
