'use client';

import { useTranslations } from 'next-intl';
import { Heart, Trash2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/useProducts';
import { useFavoritesStore } from '@/store';
import { Link } from '@/i18n/navigation';
import { useMemo } from 'react';
import { ProductGrid } from '@/components/products/ProductGrid';

export default function FavoritesPage() {
  const t = useTranslations();
  const { favorites, clearFavorites } = useFavoritesStore();

  // Fetch all products (in a real app, you'd have an API to fetch by multiple IDs)
  const { data, isLoading } = useProducts({ limit: 100 });

  // Filter products that are in favorites
  const products = data?.products;
  const favoriteProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => favorites.includes(p.product_id));
  }, [products, favorites]);

  return (
    <div className="min-h-screen pb-20">
      {/* Page Header */}
      <section className="bg-muted/30 py-12 border-b">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
              <Heart className="h-8 w-8 text-rose-500 fill-rose-500" />
              {t('profile.wishlist')}
            </h1>
            <p className="text-muted-foreground">
              {favorites.length > 0
                ? `You have ${favorites.length} items in your wishlist`
                : 'Your wishlist is empty'}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
              <Heart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Save items you like to see them later and track their
              availability.
            </p>
            <Button size="lg" asChild className="rounded-full">
              <Link href="/products">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Browse Products
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Saved Items</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={clearFavorites}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove All
              </Button>
            </div>

            <ProductGrid
              products={favoriteProducts}
              isLoading={isLoading}
              columns={4}
            />

            {!isLoading &&
              favoriteProducts.length === 0 &&
              favorites.length > 0 && (
                <p className="text-center py-10 text-muted-foreground">
                  Loading your favorite products...
                </p>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
