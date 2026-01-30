'use client';

import { cn } from '@/lib/utils';

interface PriceTagProps {
  price: string | number;
  originalPrice?: string | number;
  currency?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PriceTag({
  price,
  originalPrice,
  currency = '$',
  className,
  size = 'md',
}: PriceTagProps) {
  const formattedPrice = typeof price === 'string' ? parseFloat(price) : price;
  const formattedOriginal = originalPrice
    ? typeof originalPrice === 'string'
      ? parseFloat(originalPrice)
      : originalPrice
    : null;

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl font-bold',
  };

  const hasDiscount = formattedOriginal && formattedOriginal > formattedPrice;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span
        className={cn(
          'font-semibold text-foreground',
          sizeClasses[size],
          hasDiscount && 'text-destructive'
        )}
      >
        {currency}
        {formattedPrice.toFixed(2)}
      </span>
      {hasDiscount && (
        <span className="text-muted-foreground line-through text-sm">
          {currency}
          {formattedOriginal.toFixed(2)}
        </span>
      )}
    </div>
  );
}
