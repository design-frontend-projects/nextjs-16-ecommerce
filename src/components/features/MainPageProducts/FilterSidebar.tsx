"use client";
// components/FilterSidebar.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FilterOption {
  id: string;
  label: string;
  checked: boolean;
}

interface FilterGroup {
  title: string;
  options: FilterOption[];
  type?: 'checkbox' | 'range';
  rangeValue?: number[];
}

interface FilterSidebarProps {
  filters: FilterGroup[];
  onFilterChange: (groupId: string, optionId: string) => void;
  onRangeChange: (groupId: string, value: number[]) => void;
  onResetFilters: () => void;
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  onRangeChange,
  onResetFilters,
}: FilterSidebarProps) {

  const router = useRouter();

  return (
    <Card className="shadow">
      <CardHeader>
        <Button variant={'ghost'} onClick={() => router.push('/')}>
          <ChevronLeft className="mx-1 hover:scale-120 hover:fade-in-100 transition-all duration-200" /> Back
        </Button>
        <CardTitle className="flex items-center justify-between">
          Filters
          <Button variant="ghost" size="sm" onClick={onResetFilters}>
            Reset
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {filters.map((group, groupIndex) => (
          <div key={groupIndex}>
            <h3 className="font-medium mb-3 text-gray-700">{group.title}</h3>
            {group.type === 'range' ? (
              <div className="px-2">
                <Slider
                  value={group.rangeValue || [0, 1000]}
                  max={2000}
                  step={50}
                  onValueChange={(value) => onRangeChange(group.title, value)}
                  className="mb-4"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>${group.rangeValue?.[0] || 0}</span>
                  <span>${group.rangeValue?.[1] || 2000}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {group.options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={option.checked}
                      onCheckedChange={() =>
                        onFilterChange(group.title, option.id)
                      }
                      className="border-ecommerce-primary dark:border-slate-200 checked:bg-ecommerce-primary checked:border-ecommerce-secondary"
                    />
                    <Label
                      htmlFor={option.id}
                      className="text-gray-600 cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <div className="space-y-2">
          <Button
            variant={'default'}
            className="text-base text-white bg-ecommerce-primary border-ecommerce-primary px-8 rounded-2xl"
          >
            Apply filter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
