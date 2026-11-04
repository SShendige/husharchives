"use client";

import React, { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, Sparkles } from "lucide-react";

interface FilterBarProps {
  categories: {
    id: string;
    name: string;
    slug: string;
  }[];
  currentQuery?: string;
  currentCategory?: string;
  currentSort?: string;
  currentFeatured?: boolean;
}

export function FilterBar({
  categories,
  currentQuery = "",
  currentCategory = "",
  currentSort = "newest",
  currentFeatured = false,
}: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(currentQuery);
  const [isPending, startTransition] = useTransition();

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Reset pagination to page 1 on filter change
    params.delete("page");

    Object.entries(updates).forEach(([key, val]) => {
      if (!val || val === "all") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    startTransition(() => {
      router.push(`/explore?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ q: searchTerm.trim() || null });
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    startTransition(() => {
      router.push("/explore");
    });
  };

  const hasActiveFilters = Boolean(
    currentQuery || (currentCategory && currentCategory !== "all") || currentFeatured || currentSort !== "newest"
  );

  return (
    <div className="bg-white rounded-lg border border-dusty-violet/25 p-4 shadow-sm space-y-4">
      {/* Search and Sort Row */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search input form */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <input
            type="text"
            placeholder="Search by title, description or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm font-mono rounded-md bg-cold-paper border border-dusty-violet/30 focus:outline-none focus:border-deep-archive focus:ring-1 focus:ring-deep-archive transition"
          />
          <Search className="w-4 h-4 text-dusty-violet absolute left-3.5 top-3.5 pointer-events-none" />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                updateFilters({ q: null });
              }}
              className="absolute right-3 top-3 text-dusty-violet hover:text-deep-archive"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Sort & Quick Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Featured Toggle */}
          <button
            type="button"
            onClick={() =>
              updateFilters({
                featured: currentFeatured ? null : "true",
              })
            }
            className={`px-3 py-2 text-xs font-mono rounded-md border flex items-center gap-1.5 transition ${
              currentFeatured
                ? "bg-discovery-orange text-white border-discovery-orange font-semibold"
                : "bg-cold-paper text-deep-archive border-dusty-violet/30 hover:border-deep-archive"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured</span>
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-1">
            <label htmlFor="sort-select" className="text-xs font-mono text-archive-indigo hidden sm:inline">
              Sort:
            </label>
            <select
              id="sort-select"
              value={currentSort}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="px-3 py-2 text-xs font-mono rounded-md bg-cold-paper border border-dusty-violet/30 text-deep-archive focus:outline-none focus:border-deep-archive"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="px-2.5 py-2 text-xs font-mono text-rose-600 hover:text-rose-800 transition"
              title="Reset all filters"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Row */}
      <div className="pt-2 border-t border-dusty-violet/15 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-mono uppercase tracking-wider text-archive-indigo shrink-0 mr-1">
          Cabinet:
        </span>
        <button
          type="button"
          onClick={() => updateFilters({ category: null })}
          className={`px-2.5 py-1 rounded text-xs font-mono transition shrink-0 ${
            !currentCategory || currentCategory === "all"
              ? "bg-deep-archive text-cold-paper font-semibold"
              : "bg-archive-paper/40 text-deep-archive hover:bg-archive-paper"
          }`}
        >
          All
        </button>
        {categories.map((cat) => {
          const isSelected = currentCategory === cat.slug;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => updateFilters({ category: isSelected ? null : cat.slug })}
              className={`px-2.5 py-1 rounded text-xs font-mono transition shrink-0 ${
                isSelected
                  ? "bg-deep-archive text-cold-paper font-semibold"
                  : "bg-archive-paper/40 text-deep-archive hover:bg-archive-paper"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default FilterBar;
