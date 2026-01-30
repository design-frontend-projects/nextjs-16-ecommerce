'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProductGrid } from '@/components/products';
import { FilterPanel } from '@/components/search/FilterPanel';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { useSearchStore } from '@/store';
import type { SortOption } from '@/types/product';
import { useEffect } from 'react';

export function ProductsClient() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const {
    query,
    filters,
    setSortBy,
    setCategoryId,
    resetFilters,
    hasActiveFilters,
    toggleFilterPanel,
  } = useSearchStore();

  // Get parameters from URL
  const categoryFromUrl = searchParams.get('category');
  const searchFromUrl = searchParams.get('search');

  // Sync URL params with store on mount
  useEffect(() => {
    if (categoryFromUrl) {
      setCategoryId(parseInt(categoryFromUrl, 10));
    }
  }, [categoryFromUrl, setCategoryId]);

  // Fetch products with filters
  const { data, isLoading, error } = useProducts({
    category: filters.categoryId || undefined,
    search: searchFromUrl || query || undefined,
    minPrice: filters.minPrice || undefined,
    maxPrice: filters.maxPrice || undefined,
    sortBy: filters.sortBy,
    limit: 12,
    page: 1,
  });

  const { data: categoriesData } = useCategories();

  // Find current category name
  const currentCategory = categoriesData?.categories.find(
    (c) => c.category_id === filters.categoryId
  );

  return (
    <div className="min-h-screen pb-16">
      {/* Page Header */}
      <section className="bg-muted/30 py-12 border-b">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {searchFromUrl || query
                ? `${t('products.searchResults')} "${searchFromUrl || query}"`
                : currentCategory
                  ? currentCategory.name
                  : t('products.title')}
            </h1>
            <p className="text-muted-foreground">
              {data?.total
                ? `${data.total} ${t('products.found')}`
                : t('products.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filter - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">{t('filter.title')}</h2>
                {hasActiveFilters() && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4 mr-1" />
                    {t('filter.clearFilters')}
                  </Button>
                )}
              </div>
              <FilterPanel />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-8">
              {/* Mobile Filter Button */}
              <Button
                variant="outline"
                className="lg:hidden gap-2"
                onClick={toggleFilterPanel}
              >
                <SlidersHorizontal className="h-4 w-4" />
                {t('filter.title')}
              </Button>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-muted-foreground hidden sm:block">
                  {t('filter.sortBy')}:
                </span>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => setSortBy(value as SortOption)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">
                      {t('filter.sortNewest')}
                    </SelectItem>
                    <SelectItem value="price_asc">
                      {t('filter.sortPriceLow')}
                    </SelectItem>
                    <SelectItem value="price_desc">
                      {t('filter.sortPriceHigh')}
                    </SelectItem>
                    <SelectItem value="name_asc">
                      {t('filter.sortNameAZ')}
                    </SelectItem>
                    <SelectItem value="name_desc">
                      {t('filter.sortNameZA')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters Tags */}
            {hasActiveFilters() && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex flex-wrap gap-2 mb-6"
              >
                {currentCategory && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                    {currentCategory.name}
                    <button
                      onClick={() => setCategoryId(null)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                    ${filters.minPrice || 0} - ${filters.maxPrice || 500}
                  </span>
                )}
              </motion.div>
            )}

            {/* Products Grid */}
            {error ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {t('errors.title')}
                </h3>
                <p className="text-muted-foreground">{t('errors.default')}</p>
              </div>
            ) : (
              <ProductGrid
                products={data?.products || []}
                isLoading={isLoading}
                columns={3}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
