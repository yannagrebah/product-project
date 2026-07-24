import { memo, useCallback, useMemo } from "react";
import { useProducts } from "../hooks/useProducts";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { Button } from "./ui/button";
import { RotateCcw, LayoutGrid, List } from "lucide-react";
import type {
  ProductCategory,
  ProductStockStatus,
} from "@product-project/shared";

const CATEGORY_LABELS: Record<string, string> = {
  ALL: "All Categories",
  Electronics: "Electronics",
  Clothing: "Clothing",
  Food: "Food",
};

const STOCK_STATUS_LABELS: Record<string, string> = {
  ALL: "All Statuses",
  in_stock: "In Stock",
  low_stock: "Low Stock",
  out_of_stock: "Out of Stock",
};

const LIMIT_LABELS: Record<string, string> = {
  "5": "5 per page",
  "10": "10 per page",
  "15": "15 per page",
  "20": "20 per page",
};

export const ProductFilters = memo(function ProductFilters() {
  const {
    category,
    stock_status,
    limit,
    viewMode,
    setCategory,
    setStockStatus,
    setLimit,
    setViewMode,
    resetFilters,
  } = useProducts();

  const hasActiveFilters = useMemo(
    () => category !== null || stock_status !== null,
    [category, stock_status],
  );

  const handleCategoryChange = useCallback(
    (val: string | null) => {
      setCategory(val === "ALL" || !val ? null : (val as ProductCategory));
    },
    [setCategory],
  );

  const handleStockStatusChange = useCallback(
    (val: string | null) => {
      setStockStatus(
        val === "ALL" || !val ? null : (val as ProductStockStatus),
      );
    },
    [setStockStatus],
  );

  const handleLimitChange = useCallback(
    (val: string | null) => {
      if (val) setLimit(parseInt(val, 10));
    },
    [setLimit],
  );

  const selectedCategoryLabel = useMemo(
    () => CATEGORY_LABELS[category || "ALL"] || "All Categories",
    [category],
  );

  const selectedStockStatusLabel = useMemo(
    () => STOCK_STATUS_LABELS[stock_status || "ALL"] || "All Statuses",
    [stock_status],
  );

  const selectedLimitLabel = useMemo(
    () => LIMIT_LABELS[limit.toString()] || `${limit} per page`,
    [limit],
  );

  return (
    <div className="w-full bg-white/80 backdrop-blur-md border border-zinc-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4 animate-in fade-in-0 slide-in-from-top-3 duration-500">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-zinc-100">
        <span className="text-3xs capitalize tracking-widest font-semibold text-zinc-500">
          Filter Criteria
        </span>

        <div className="flex items-center gap-2">
          {/* View Mode Switcher */}
          <div className="flex items-center gap-0.5 bg-zinc-100/80 p-0.5 rounded-xl border border-zinc-200/80">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setViewMode("grid")}
              className={`h-7 w-7 rounded-lg transition-all duration-200 active:scale-95 ${
                viewMode === "grid"
                  ? "bg-white shadow-2xs text-zinc-900 font-semibold scale-105"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setViewMode("list")}
              className={`h-7 w-7 rounded-lg transition-all duration-200 active:scale-95 ${
                viewMode === "list"
                  ? "bg-white shadow-2xs text-zinc-900 font-semibold scale-105"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50"
              }`}
              title="List View"
            >
              <List className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {/* Category Dropdown */}
        <div className="space-y-1">
          <label className="text-3xs capitalize tracking-widest font-medium text-zinc-500 px-1">
            Category
          </label>
          <Select
            value={category || "ALL"}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-full bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 hover:border-zinc-300 transition-colors duration-200">
              <SelectValue placeholder="All Categories">
                {selectedCategoryLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white border-zinc-200 text-zinc-800 shadow-lg animate-in fade-in-0 zoom-in-95 duration-150">
              <SelectItem value="ALL">All Categories</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Clothing">Clothing</SelectItem>
              <SelectItem value="Food">Food</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stock Status Dropdown */}
        <div className="space-y-1">
          <label className="text-3xs capitalize tracking-widest font-medium text-zinc-500 px-1">
            Stock Status
          </label>
          <Select
            value={stock_status || "ALL"}
            onValueChange={handleStockStatusChange}
          >
            <SelectTrigger className="w-full bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 hover:border-zinc-300 transition-colors duration-200">
              <SelectValue placeholder="All Stock Statuses">
                {selectedStockStatusLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white border-zinc-200 text-zinc-800 shadow-lg animate-in fade-in-0 zoom-in-95 duration-150">
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="in_stock">In Stock</SelectItem>
              <SelectItem value="low_stock">Low Stock</SelectItem>
              <SelectItem value="out_of_stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Items Per Page Dropdown */}
        <div className="space-y-1">
          <label className="text-3xs capitalize tracking-widest font-medium text-zinc-500 px-1">
            Display Limit
          </label>
          <Select value={limit.toString()} onValueChange={handleLimitChange}>
            <SelectTrigger className="w-full bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 hover:border-zinc-300 transition-colors duration-200">
              <SelectValue placeholder="10 per page">
                {selectedLimitLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white border-zinc-200 text-zinc-800 shadow-lg animate-in fade-in-0 zoom-in-95 duration-150">
              <SelectItem value="5">5 per page</SelectItem>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="15">15 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quick Reset Pill */}
        <div className="flex justify-end items-center sm:col-span-3 lg:col-span-1">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-2xs text-zinc-500 hover:text-zinc-900 gap-1.5 h-7 px-2 active:scale-95 transition-all animate-in fade-in-0 zoom-in-95 duration-200"
            >
              <RotateCcw className="size-3" />
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  );
});
