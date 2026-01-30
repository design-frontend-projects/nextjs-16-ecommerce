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

  // Check if product is new (created within last 7 days)
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

  // Generate placeholder image based on product name
  const imageUrl = `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&q=80`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className={className}
    >
      <Card className="group relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-card">
        <Link href={`/products/${product.product_id}`}>
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-muted/30">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
              {isNew() && <BadgeNew />}
            </div>

            {/* Quick Actions Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                size="icon"
                variant="secondary"
                className={cn(
                  'h-9 w-9 rounded-full shadow-lg backdrop-blur-sm',
                  isFavorite && 'bg-rose-500 text-white hover:bg-rose-600'
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
                  variant="secondary"
                  className="h-9 w-9 rounded-full shadow-lg backdrop-blur-sm"
                  aria-label="Quick view"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Add to Cart Button */}
            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                className="w-full rounded-full shadow-lg backdrop-blur-sm"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>

          {/* Content */}
          <CardContent className="p-4 space-y-2">
            {/* Category */}
            {product.category && (
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                {product.category.name}
              </span>
            )}

            {/* Title */}
            <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {/* Price */}
            <PriceTag price={product.base_price} size="md" />

            {/* Stock Status */}
            {product.inventory && product.inventory.quantity > 0 ? (
              product.inventory.quantity <= 5 && (
                <span className="text-xs text-amber-600">
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
