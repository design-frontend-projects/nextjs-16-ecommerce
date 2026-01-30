'use client';

import { cn } from '@/lib/utils';

interface BadgeNewProps {
  className?: string;
  children?: React.ReactNode;
}

export function BadgeNew({ className, children = 'New' }: BadgeNewProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold',
        'bg-gradient-to-r from-emerald-500 to-teal-500 text-white',
        'shadow-sm',
        className
      )}
    >
      {children}
    </span>
  );
}

export function BadgeSale({ className, children = 'Sale' }: BadgeNewProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold',
        'bg-gradient-to-r from-rose-500 to-pink-500 text-white',
        'shadow-sm',
        className
      )}
    >
      {children}
    </span>
  );
}

export function BadgeOutOfStock({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold',
        'bg-muted text-muted-foreground',
        className
      )}
    >
      Out of Stock
    </span>
  );
}
