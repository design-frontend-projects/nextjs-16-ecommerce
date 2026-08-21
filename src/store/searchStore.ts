import { create } from 'zustand';
import type { SortOption } from '@/types/product';

interface SearchFilters {
  categoryId: string | number | null;
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: SortOption;
  inStock: boolean | null;
}

interface SearchState {
  query: string;
  filters: SearchFilters;
  isFilterOpen: boolean;

  // Actions
  setQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  setCategoryId: (categoryId: string | number | null) => void;
  setPriceRange: (min: number | null, max: number | null) => void;
  setSortBy: (sortBy: SortOption) => void;
  toggleFilterPanel: () => void;
  openFilterPanel: () => void;
  closeFilterPanel: () => void;

  // Getters
  hasActiveFilters: () => boolean;
  getActiveFilterCount: () => number;
}

const defaultFilters: SearchFilters = {
  categoryId: null,
  minPrice: null,
  maxPrice: null,
  sortBy: 'newest',
  inStock: null,
};

export const useSearchStore = create<SearchState>()((set, get) => ({
  query: '',
  filters: { ...defaultFilters },
  isFilterOpen: false,

  setQuery: (query) => set({ query }),

  setFilters: (filters) =>
    set({
      filters: { ...get().filters, ...filters },
    }),

  resetFilters: () =>
    set({
      query: '',
      filters: { ...defaultFilters },
    }),

  setCategoryId: (categoryId) =>
    set({
      filters: { ...get().filters, categoryId },
    }),

  setPriceRange: (min, max) =>
    set({
      filters: { ...get().filters, minPrice: min, maxPrice: max },
    }),

  setSortBy: (sortBy) =>
    set({
      filters: { ...get().filters, sortBy },
    }),

  toggleFilterPanel: () => set({ isFilterOpen: !get().isFilterOpen }),
  openFilterPanel: () => set({ isFilterOpen: true }),
  closeFilterPanel: () => set({ isFilterOpen: false }),

  hasActiveFilters: () => {
    const { query, filters } = get();
    return (
      query !== '' ||
      filters.categoryId !== null ||
      filters.minPrice !== null ||
      filters.maxPrice !== null ||
      filters.sortBy !== 'newest' ||
      filters.inStock !== null
    );
  },

  getActiveFilterCount: () => {
    const { filters } = get();
    let count = 0;
    if (filters.categoryId !== null) count++;
    if (filters.minPrice !== null || filters.maxPrice !== null) count++;
    if (filters.sortBy !== 'newest') count++;
    if (filters.inStock !== null) count++;
    return count;
  },
}));
