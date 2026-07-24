import { Suspense, lazy } from "react";
import { ProductSkeleton, FiltersSkeleton } from "./components/ProductSkeleton";
import { API_BASE_URL } from "./store/useProductsStore";

const ProductFilters = lazy(() =>
  import("./components/ProductFilters").then((m) => ({
    default: m.ProductFilters,
  })),
);
const ProductGrid = lazy(() =>
  import("./components/ProductGrid").then((m) => ({
    default: m.ProductGrid,
  })),
);
const ProductPagination = lazy(() =>
  import("./components/ProductPagination").then((m) => ({
    default: m.ProductPagination,
  })),
);

export function App() {
  return (
    <div className="min-h-screen bg-zinc-50/60 text-zinc-900 font-sans selection:bg-zinc-200 selection:text-zinc-900 flex flex-col">
      {/* Minimalist Light Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-zinc-900 flex items-center gap-2">
                PRODUCT CATALOG
              </h1>
              <p className="text-2xs text-zinc-500 hidden sm:block">
                In-Memory Store & Cache
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full border border-zinc-200 bg-white text-xs text-zinc-600 font-mono shadow-2xs">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>API {API_BASE_URL}/products is online</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Short App Description */}
        <section
          aria-label="Application Description"
          className="space-y-1 inline-flex flex-col items-center justify-center w-full"
        >
          <p className="text-xs text-zinc-600 leading-relaxed max-w-3xl text-center">
            Explore our high-performance product catalog featuring real-time
            debounced search, multi-criteria category & stock filtering, and
            adaptive grid/list layouts. Powered by a NestJS in-memory cache endpoint and
            Zustand reactive state engine.
          </p>
        </section>

        {/* Minimal Filters Section with Suspense */}
        <section aria-label="Product Filters">
          <Suspense fallback={<FiltersSkeleton />}>
            <ProductFilters />
          </Suspense>
        </section>

        {/* Product Catalog Grid with Suspense */}
        <section aria-label="Product Catalog List" className="min-h-105">
          <Suspense fallback={<ProductSkeleton />}>
            <ProductGrid />
          </Suspense>
        </section>

        {/* Minimal Pagination with Suspense */}
        <section aria-label="Product Pagination">
          <Suspense fallback={null}>
            <ProductPagination />
          </Suspense>
        </section>
      </main>

      {/* Clean Footer */}
      <footer className="w-full border-t border-zinc-200/80 py-6 text-center text-2xs text-zinc-500 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5">
            © {new Date().getFullYear()}{" "}
            <a
              href="https://github.com/yannagrebah/product-project"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-zinc-700 hover:text-zinc-900 transition-colors font-medium"
            >
              <img
                src="/icons/github.svg"
                alt="GitHub"
                className="size-3.5 inline-block opacity-80 hover:opacity-100 transition-opacity"
              />
              <span>yannagrebah</span>
            </a>
          </span>
          <span className="font-mono text-zinc-400">
            NestJS • React • Vite • Zustand • Tailwind
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
