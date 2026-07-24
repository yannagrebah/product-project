import { ProductFilters } from "./components/ProductFilters";
import { ProductGrid } from "./components/ProductGrid";
import { ProductPagination } from "./components/ProductPagination";

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

          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full border border-zinc-200 bg-white text-2xs text-zinc-600 font-medium shadow-2xs">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>API Online</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Minimal Filters Section */}
        <section aria-label="Product Filters">
          <ProductFilters />
        </section>

        {/* Product Catalog Grid */}
        <section aria-label="Product Catalog List" className="min-h-105">
          <ProductGrid />
        </section>

        {/* Minimal Pagination */}
        <section aria-label="Product Pagination">
          <ProductPagination />
        </section>
      </main>

      {/* Clean Footer */}
      <footer className="w-full border-t border-zinc-200/80 py-6 text-center text-2xs text-zinc-500 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} yannagrebah</span>
          <span className="font-mono text-zinc-400">
            NestJS • React • Vite • Zustand • Tailwind
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
