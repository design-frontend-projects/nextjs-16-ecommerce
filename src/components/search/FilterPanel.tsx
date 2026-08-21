'use client';

import { useTranslations } from 'next-intl';
import { SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useSearchStore } from '@/store';
import { useCategories } from '@/hooks/useProducts';
import type { SortOption } from '@/types/product';
import { cn } from '@/lib/utils';

interface FilterPanelProps {
  className?: string;
  onApply?: () => void;
}

export function FilterPanel({ className, onApply }: FilterPanelProps) {
  const t = useTranslations('filter');
  const { data: categoriesData } = useCategories();
  const {
    filters,
    setCategoryId,
    setPriceRange,
    setSortBy,
    resetFilters,
    hasActiveFilters,
    getActiveFilterCount,
    closeFilterPanel,
    isFilterOpen,
    toggleFilterPanel,
  } = useSearchStore();

  const handleApply = () => {
    closeFilterPanel();
    onApply?.();
  };

  const filterContent = (
    <div className="space-y-6">
      {/* Sort By */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">{t('sortBy')}</Label>
        <Select
          value={filters.sortBy}
          onValueChange={(value) => setSortBy(value as SortOption)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('sortBy')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t('sortNewest')}</SelectItem>
            <SelectItem value="price_asc">{t('sortPriceLow')}</SelectItem>
            <SelectItem value="price_desc">{t('sortPriceHigh')}</SelectItem>
            <SelectItem value="name_asc">{t('sortNameAZ')}</SelectItem>
            <SelectItem value="name_desc">{t('sortNameZA')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Categories */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">{t('category')}</Label>
        <div className="space-y-2">
          <div
            className={cn(
              'flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors',
              filters.categoryId === null ? 'bg-primary/10' : 'hover:bg-muted'
            )}
            onClick={() => setCategoryId(null)}
          >
            <Checkbox
              id="all-categories"
              checked={filters.categoryId === null}
              onCheckedChange={() => setCategoryId(null)}
            />
            <Label
              htmlFor="all-categories"
              className="cursor-pointer flex-1 capitalize"
            >
              {t('allCategories')}
            </Label>
          </div>
          {categoriesData?.categories.map((category) => (
            <div
              key={category.category_id}
              className={cn(
                'flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors',
                filters.categoryId === category.category_id
                  ? 'bg-primary/10'
                  : 'hover:bg-muted'
              )}
              onClick={() => setCategoryId(category.category_id)}
            >
              <Checkbox
                id={`category-${category.category_id}`}
                checked={filters.categoryId === category.category_id}
                onCheckedChange={() => setCategoryId(category.category_id)}
              />
              <Label
                htmlFor={`category-${category.category_id}`}
                className="cursor-pointer flex-1 capitalize"
              >
                {category.name}
              </Label>
              {category.products_count !== undefined && (
                <span className="text-xs text-muted-foreground">
                  ({category.products_count})
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">{t('priceRange')}</Label>
        <div className="px-2">
          <Slider
            value={[filters.minPrice || 0, filters.maxPrice || 500]}
            min={0}
            max={500}
            step={10}
            onValueChange={([min, max]) => setPriceRange(min, max)}
            className="w-full"
          />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>${filters.minPrice || 0}</span>
            <span>${filters.maxPrice || 500}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filter Panel */}
      <div className={cn('hidden lg:block', className)}>{filterContent}</div>

      {/* Mobile Filter Sheet */}
      <Sheet open={isFilterOpen} onOpenChange={toggleFilterPanel}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="outline" size="sm" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            {t('title')}
            {hasActiveFilters() && (
              <span className="bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-xs">
                {getActiveFilterCount()}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              {t('title')}
              {hasActiveFilters() && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-destructive"
                >
                  <X className="h-4 w-4 mr-1" />
                  {t('clearFilters')}
                </Button>
              )}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6 overflow-y-auto">{filterContent}</div>
          <SheetFooter className="mt-6">
            <Button onClick={handleApply} className="w-full">
              {t('applyFilters')}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
