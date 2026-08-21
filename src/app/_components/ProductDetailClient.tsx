'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Heart,
  ShoppingCart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PriceTag } from '@/components/ui/price-tag';
import { QuantitySelector } from '@/components/ui/quantity-selector';
import { ProductGrid } from '@/components/products';
import { Link } from '@/i18n/navigation';
import { useProduct } from '@/hooks/useProducts';
import { useCartStore, useFavoritesStore } from '@/store';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProductDetailClientProps {
  id: string;
}

export function ProductDetailClient({ id }: ProductDetailClientProps) {
  const t = useTranslations();
  const productId = parseInt(id, 10);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data, isLoading, error } = useProduct(productId);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isFavorite = useFavoritesStore((state) => state.isFavorite(productId));

  // Placeholder images
  const productImages = [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop&q=90',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=800&fit=crop&q=90',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop&q=90',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop&q=90',
  ];

  const handleAddToCart = () => {
    if (data?.product) {
      addItem(data.product, quantity);
      openCart();
    }
  };

  if (isLoading) return <ProductDetailSkeleton />;

  if (error || !data?.product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-2xl font-bold mb-2">{t('errors.notFound')}</h1>
        <p className="text-muted-foreground mb-6">
          {t('errors.productNotFound')}
        </p>
        <Button asChild rounded-full>
          <Link href="/products">{t('common.backToProducts')}</Link>
        </Button>
      </div>
    );
  }

  const { product, relatedProducts } = data;
  const inStock = Boolean(product.inventory && (product.inventory.quantity ?? 0) > 0);
  const lowStock = Boolean(product.inventory && (product.inventory.quantity ?? 0) <= 5);

  return (
    <div className="min-h-screen pb-16">
      <nav className="container mx-auto px-4 py-4">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors">
              {t('nav.home')}
            </Link>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li>
            <Link
              href="/products"
              className="hover:text-foreground transition-colors"
            >
              {t('nav.products')}
            </Link>
          </li>
          {product.category && (
            <>
              <ChevronRight className="h-4 w-4" />
              <li>
                <Link
                  href={`/products?category=${product.category.category_id}`}
                  className="hover:text-foreground transition-colors capitalize"
                >
                  {product.category.name}
                </Link>
              </li>
            </>
          )}
          <ChevronRight className="h-4 w-4" />
          <li className="text-foreground font-medium truncate max-w-[200px]">
            {product.name}
          </li>
        </ol>
      </nav>

      <section className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
              <Image
                src={productImages[selectedImage]}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <Button
                size="icon"
                variant="secondary"
                className={cn(
                  'absolute top-4 right-4 rounded-full shadow-lg',
                  isFavorite && 'bg-rose-500 text-white hover:bg-rose-600'
                )}
                onClick={() => toggleFavorite(productId)}
              >
                <Heart
                  className={cn('h-5 w-5', isFavorite && 'fill-current')}
                />
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  className={cn(
                    'relative aspect-square rounded-lg overflow-hidden border-2 transition-colors',
                    selectedImage === index
                      ? 'border-primary'
                      : 'border-transparent hover:border-muted-foreground/30'
                  )}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={img}
                    alt={`${product.name} - View ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {product.category && (
              <Link
                href={`/products?category=${product.category.category_id}`}
                className="text-sm text-primary font-medium uppercase tracking-wide hover:underline"
              >
                {product.category.name}
              </Link>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {product.name}
            </h1>

            <PriceTag price={product.base_price} size="lg" />

            <div className="flex items-center gap-2">
              {inStock ? (
                <>
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-green-500 font-medium">
                    {lowStock
                      ? `Only ${product.inventory?.quantity} left`
                      : 'In Stock'}
                  </span>
                </>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {product.description ||
                'No description available for this product.'}
            </p>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  {t('product.quantity')}:
                </span>
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  max={product.inventory?.quantity || 10}
                  disabled={!inStock}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="flex-1 rounded-full"
                  onClick={handleAddToCart}
                  disabled={!inStock}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {t('product.addToCart')}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => toggleFavorite(productId)}
                >
                  <Heart
                    className={cn(
                      'h-5 w-5 mr-2',
                      isFavorite && 'fill-current text-rose-500'
                    )}
                  />
                  {isFavorite
                    ? t('product.removeFromWishlist')
                    : t('product.addToWishlist')}
                </Button>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4">
              {[
                {
                  icon: Truck,
                  title: 'Free Shipping',
                  description: 'On orders over $50',
                },
                {
                  icon: ShieldCheck,
                  title: 'Secure Payment',
                  description: '100% secure checkout',
                },
                {
                  icon: RotateCcw,
                  title: 'Easy Returns',
                  description: '30-day return policy',
                },
              ].map((feature) => (
                <div key={feature.title} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <span className="font-medium text-sm">{feature.title}</span>
                    <p className="text-xs text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger
              value="details"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-6"
            >
              {t('product.details')}
            </TabsTrigger>
            <TabsTrigger
              value="specifications"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-6"
            >
              {t('product.specifications')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="py-6">
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p>
                {product.description || 'No detailed description available.'}
              </p>
            </div>
          </TabsContent>
          <TabsContent value="specifications" className="py-6">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex justify-between py-2 border-b">
                <dt className="text-muted-foreground">SKU</dt>
                <dd className="font-medium">{product.sku || 'N/A'}</dd>
              </div>
              {product.weight && (
                <div className="flex justify-between py-2 border-b">
                  <dt className="text-muted-foreground">Weight</dt>
                  <dd className="font-medium">{product.weight} kg</dd>
                </div>
              )}
              {product.dimensions && (
                <div className="flex justify-between py-2 border-b">
                  <dt className="text-muted-foreground">Dimensions</dt>
                  <dd className="font-medium">{product.dimensions}</dd>
                </div>
              )}
            </dl>
          </TabsContent>
        </Tabs>
      </section>

      {relatedProducts && relatedProducts.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-foreground mb-8">
            {t('product.relatedProducts')}
          </h2>
          <ProductGrid products={relatedProducts} columns={4} />
        </section>
      )}
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
