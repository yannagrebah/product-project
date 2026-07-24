import { memo, useMemo } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import type { Product } from '@product-project/shared';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard = memo(
  function ProductCard({ product, index = 0 }: ProductCardProps) {
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
      () => ({ animationDelay: `${Math.min(index * 60, 480)}ms` }),
      [index],
    );

    return (
      <Card
        style={animationDelayStyle}
        className="group relative h-full flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/80 bg-white hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-200/50 hover:-translate-y-1 transition-all ease-out active:scale-[0.99] animate-in fade-in-0 slide-in-from-bottom-4 duration-500 fill-mode-backwards"
      >
        {/* Product Image Container */}
        <div className="relative aspect-4/3 w-full overflow-hidden bg-zinc-100">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            loading="lazy"
          />

          {/* Category Pill Over Image */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-2xs font-medium bg-white/90 text-zinc-800 border border-zinc-200/80 backdrop-blur-md shadow-2xs group-hover:bg-white transition-colors duration-300">
              {product.category}
            </span>
          </div>
        </div>

        {/* Product Details */}
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold text-zinc-900 line-clamp-1 group-hover:text-zinc-700 transition-colors duration-200">
            {product.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="px-4 py-1">
          {/* Stock Status Badge */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className={`size-1.5 rounded-full ${stockInfo.dot}`} />
            <span className={`text-2xs font-medium ${stockInfo.text}`}>
              {stockInfo.label}
            </span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-3 flex items-center justify-between border-t border-zinc-100 mt-auto">
          <div className="flex flex-col">
            <span className="text-3xs text-zinc-400 font-medium uppercase tracking-wider">
              Price
            </span>
            <span className="text-base font-bold text-zinc-900 tracking-tight group-hover:scale-105 origin-left transition-transform duration-200">
              {formattedPrice}
            </span>
          </div>
          <span className="text-3xs text-zinc-400 font-mono">
            #{product.id}
          </span>
        </CardFooter>
      </Card>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.index === nextProps.index &&
      prevProps.product.id === nextProps.product.id &&
      prevProps.product.name === nextProps.product.name &&
      prevProps.product.price === nextProps.product.price &&
      prevProps.product.category === nextProps.product.category &&
      prevProps.product.stock_status === nextProps.product.stock_status &&
      prevProps.product.imageUrl === nextProps.product.imageUrl
    );
  },
);
