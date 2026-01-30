'use client';

import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuantitySelector } from '@/components/ui/quantity-selector';
import { PriceTag } from '@/components/ui/price-tag';
import { useCartStore } from '@/store';
import { Link } from '@/i18n/navigation';
import type { CartItem as CartItemType } from '@/types/product';

interface CartItemProps {
  item: CartItemType;
  compact?: boolean;
}

export function CartItem({ item, compact = false }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const { product, quantity } = item;

  const total = parseFloat(product.base_price) * quantity;
  const imageUrl = `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop&q=80`;

  if (compact) {
    return (
      <div className="flex items-center gap-3 py-3">
        {/* Image */}
        <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <Link
            href={`/products/${product.product_id}`}
            className="font-medium text-sm line-clamp-1 hover:text-primary transition-colors"
          >
            {product.name}
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground">
              Qty: {quantity}
            </span>
            <span className="text-sm font-semibold">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Remove */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={() => removeItem(product.product_id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4 py-4">
      {/* Image */}
      <div className="relative h-24 w-24 rounded-xl overflow-hidden bg-muted flex-shrink-0">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${product.product_id}`}
          className="font-medium text-foreground line-clamp-2 hover:text-primary transition-colors"
        >
          {product.name}
        </Link>

        {product.category && (
          <span className="text-xs text-muted-foreground capitalize">
            {product.category.name}
          </span>
        )}

        <div className="flex items-center justify-between mt-3">
          <QuantitySelector
            value={quantity}
            onChange={(value) => updateQuantity(product.product_id, value)}
            size="sm"
          />

          <PriceTag price={total} size="md" />
        </div>
      </div>

      {/* Remove */}
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 text-muted-foreground hover:text-destructive flex-shrink-0"
        onClick={() => removeItem(product.product_id)}
        aria-label="Remove item"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
