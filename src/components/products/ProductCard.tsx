'use client';

import Image from 'next/image';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PriceTag } from '@/components/ui/price-tag';
import { BadgeNew } from '@/components/ui/badge-new';
import { useCartStore, useFavoritesStore } from '@/store';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  className?: string;
  showQuickView?: boolean;
}

export function ProductCard({
  product,
  className,
  showQuickView = true,
}: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isFavorite = useFavoritesStore((state) =>
    state.isFavorite(product.product_id)
  );

  const isNew = () => {
    const createdAt = new Date(product.created_at);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays <= 7;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    openCart();
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.product_id);
  };

  const imageUrl = `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&q=80`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      className={className}
    >
      <Card className="group relative overflow-hidden border bg-card hover:shadow-lg transition-all duration-200 cursor-pointer">
        <Link href={`/products/${product.product_id}`}>
          <div className="relative aspect-square overflow-hidden bg-muted/30">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-opacity duration-300 group-hover:opacity-90"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />

            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
              {isNew() && <BadgeNew />}
            </div>

            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                size="icon"
                variant="ghost"
                className={cn(
                  'h-9 w-9 rounded-full',
                  isFavorite && 'bg-accent text-accent-foreground'
                )}
                onClick={handleToggleFavorite}
                aria-label={
                  isFavorite ? 'Remove from favorites' : 'Add to favorites'
                }
              >
                <Heart
                  className={cn('h-4 w-4', isFavorite && 'fill-current')}
                />
              </Button>
              {showQuickView && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 rounded-full"
                  aria-label="Quick view"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <CardContent className="p-4 space-y-2">
            {product.category && (
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                {product.category.name}
              </span>
            )}

            <h3 className="font-medium text-foreground line-clamp-2">
              {product.name}
            </h3>

            <PriceTag price={product.base_price} size="md" />

            {product.inventory && (product.inventory.quantity ?? 0) > 0 ? (
              (product.inventory.quantity ?? 0) <= 5 && (
                <span className="text-xs text-muted-foreground">
                  Only {product.inventory.quantity} left
                </span>
              )
            ) : (
              <span className="text-xs text-muted-foreground">
                Out of stock
              </span>
            )}
          </CardContent>
        </Link>
      </Card>
    </motion.div>
  );
}