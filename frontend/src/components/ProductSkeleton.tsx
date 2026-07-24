import { memo } from 'react';

interface ProductSkeletonProps {
  count?: number;
}

export const ProductSkeleton = memo(function ProductSkeleton({
  count = 8,
}: ProductSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full animate-in fade-in-0 duration-300">
      {Array.from({ length: count }).map((_, index) => (
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
});

export const FiltersSkeleton = memo(function FiltersSkeleton() {
  return (
    <div className="w-full bg-white/80 border border-zinc-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4 animate-pulse">
      <div className="h-4 w-32 bg-zinc-100 rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <div className="h-9 bg-zinc-100 rounded-xl" />
        <div className="h-9 bg-zinc-100 rounded-xl" />
        <div className="h-9 bg-zinc-100 rounded-xl" />
        <div className="h-9 bg-zinc-100 rounded-xl" />
      </div>
    </div>
  );
});
