'use client';

import { useRouter, usePathname } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ProductSort() {
  const t = useTranslations('filter');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sort') || 'newest';

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground hidden sm:inline-block">
        {t('sortBy')}:
      </span>
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px]">
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
  );
}
