import { memo, useMemo } from 'react';
import type { Product } from '@product-project/shared';

interface ProductListItemProps {
  product: Product;
  index?: number;
}

export const ProductListItem = memo(function ProductListItem({
  product,
  index = 0,
}: ProductListItemProps) {
  const stockInfo = useMemo(() => {
    switch (product.stock_status) {
      case 'in_stock':
        return {
          label: 'In Stock',
          dot: 'bg-emerald-500 shadow-xs shadow-emerald-500/50',
          text: 'text-zinc-600',
        };
      case 'low_stock':
        return {
          label: 'Low Stock',
          dot: 'bg-amber-500 animate-pulse shadow-xs shadow-amber-500/50',
          text: 'text-amber-700',
        };
      case 'out_of_stock':
        return {
          label: 'Out of Stock',
          dot: 'bg-rose-500 shadow-xs shadow-rose-500/50',
          text: 'text-rose-600',
        };
      default:
        return {
          label: product.stock_status,
          dot: 'bg-zinc-400',
          text: 'text-zinc-500',
        };
    }
  }, [product.stock_status]);

  const formattedPrice = useMemo(() => {
    return `$${product.price.toFixed(2)}`;
  }, [product.price]);

  const animationDelayStyle = useMemo(
    () => ({ animationDelay: `${Math.min(index * 50, 400)}ms` }),
    [index],
  );

  return (
    <div
      style={animationDelayStyle}
      className="group relative w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-zinc-200/80 bg-white hover:shadow-lg hover:shadow-zinc-200/50 hover:border-zinc-300 hover:-translate-y-0.5 transition-all duration-300 ease-out active:scale-[0.995] animate-in fade-in-0 slide-in-from-left-3 duration-500 fill-mode-backwards"
    >
      <div className="flex items-center gap-4 min-w-0">
        {/* Product Image Thumbnail */}
        <div className="relative size-20 sm:size-24 rounded-xl overflow-hidden bg-zinc-100 shrink-0">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            loading="lazy"
          />
        </div>

        {/* Product Meta */}
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-3xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200/80 group-hover:bg-zinc-200/60 transition-colors duration-200">
              {product.category}
            </span>
            <span className="text-3xs text-zinc-400 font-mono">
              #{product.id}
            </span>
          </div>

          <h3 className="text-sm font-semibold text-zinc-900 truncate group-hover:text-zinc-700 transition-colors duration-200">
            {product.name}
          </h3>

          <div className="flex items-center gap-1.5 text-xs">
            <span className={`size-1.5 rounded-full ${stockInfo.dot}`} />
            <span className={`text-2xs font-medium ${stockInfo.text}`}>
              {stockInfo.label}
            </span>
          </div>
        </div>
      </div>

      {/* Price & Action area */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-zinc-100 pt-2 sm:pt-0 shrink-0">
        <span className="text-3xs text-zinc-400 font-medium uppercase tracking-wider hidden sm:block">
          Price
        </span>
        <span className="text-lg font-bold text-zinc-900 tracking-tight group-hover:scale-105 origin-right transition-transform duration-200">
          {formattedPrice}
        </span>
      </div>
    </div>
  );
});
