'use client';

import { useRouter, usePathname } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Category } from '@/types/product';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ProductFiltersProps {
  categories: Category[];
  minPrice?: number;
  maxPrice?: number;
}

// Inline debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export function ProductFilters({
  categories,
  minPrice = 0,
  maxPrice = 1000,
}: ProductFiltersProps) {
  const t = useTranslations('filter');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local state for immediate UI feedback
  const initialMin = Number(searchParams.get('minPrice')) || minPrice;
  const initialMax = Number(searchParams.get('maxPrice')) || maxPrice;

  const [priceRange, setPriceRange] = useState([initialMin, initialMax]);
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const debouncedSearch = useDebounce(search, 500);
  const debouncedPrice = useDebounce(priceRange, 500);

  // Helper to update params
  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const currentSearch = searchParams.get('search') || '';
    if (debouncedSearch !== currentSearch) {
      updateParams({ search: debouncedSearch || null });
    }
  }, [debouncedSearch]);

  useEffect(() => {
    const currentMin = Number(searchParams.get('minPrice')) || minPrice;
    const currentMax = Number(searchParams.get('maxPrice')) || maxPrice;

    // Only update if changed and not initial mount with defaults
    if (debouncedPrice[0] !== currentMin || debouncedPrice[1] !== currentMax) {
      updateParams({
        minPrice: debouncedPrice[0].toString(),
        maxPrice: debouncedPrice[1].toString(),
      });
    }
  }, [debouncedPrice]);

  const handleCategoryChange = (categoryId: string | null) => {
    updateParams({ category: categoryId });
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label>{t('search')}</Label>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Separator />

      {/* Categories */}
      <div className="space-y-3">
        <Label>{t('category')}</Label>
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="cat-all"
              checked={!searchParams.get('category')}
              onCheckedChange={() => handleCategoryChange(null)}
            />
            <Label htmlFor="cat-all" className="cursor-pointer font-normal">
              All Categories
            </Label>
          </div>
          {categories.map((cat) => (
            <div key={cat.category_id} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${cat.category_id}`}
                checked={
                  searchParams.get('category') === cat.category_id.toString()
                }
                onCheckedChange={() =>
                  handleCategoryChange(cat.category_id.toString())
                }
              />
              <Label
                htmlFor={`cat-${cat.category_id}`}
                className="cursor-pointer font-normal"
              >
                {cat.name}
                {cat.products_count !== undefined && (
                  <span className="text-muted-foreground ml-1">
                    ({cat.products_count})
                  </span>
                )}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>{t('priceRange')}</Label>
          <span className="text-sm font-medium">
            ${priceRange[0]} - ${priceRange[1]}
          </span>
        </div>
        <Slider
          defaultValue={[minPrice, maxPrice]}
          value={priceRange}
          min={minPrice}
          max={maxPrice}
          step={10}
          onValueChange={setPriceRange}
          className="py-4"
        />
      </div>

      <Separator />

      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setSearch('');
          setPriceRange([minPrice, maxPrice]);
          router.push(pathname, { scroll: false });
        }}
      >
        {t('clearFilters')}
      </Button>
    </div>
  );
}
