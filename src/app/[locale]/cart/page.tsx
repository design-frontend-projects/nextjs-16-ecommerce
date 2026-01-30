'use client';

import { useTranslations } from 'next-intl';
import { ShoppingBag, ArrowRight, Trash2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { CartItem } from '@/components/cart/CartItem';
import { useCartStore } from '@/store';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

export default function CartPage() {
  const t = useTranslations('cart');
  const { items, getSubtotal, getItemCount, clearCart } = useCartStore();

  const subtotal = getSubtotal();
  const itemCount = getItemCount();
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.15; // 15% VAT example
  const total = subtotal + shipping + tax;

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
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {t('title')}
            </h1>
            <p className="text-muted-foreground">
              {itemCount > 0
                ? `${itemCount} ${itemCount === 1 ? 'item' : 'items'} in your cart`
                : t('empty')}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {t('empty')}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              {t('emptySubtitle')}
            </p>
            <Button size="lg" asChild className="rounded-full">
              <Link href="/products">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('continueShopping')}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Order Items</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={clearCart}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
              </div>

              <Card className="border-none shadow-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="divide-y">
                    {items.map((item) => (
                      <div key={item.product.product_id} className="px-6">
                        <CartItem item={item} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Button variant="ghost" asChild className="mt-4">
                <Link href="/products">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('continueShopping')}
                </Link>
              </Button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="border-none shadow-md overflow-hidden bg-card">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t('subtotal')}
                        </span>
                        <span className="font-medium">
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t('shipping')}
                        </span>
                        <span
                          className={cn(
                            'font-medium',
                            shipping === 0 && 'text-green-500 uppercase text-xs'
                          )}
                        >
                          {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t('tax')} (15%)
                        </span>
                        <span className="font-medium">${tax.toFixed(2)}</span>
                      </div>

                      <Separator className="my-4" />

                      <div className="flex justify-between text-lg font-bold">
                        <span>{t('total')}</span>
                        <span className="text-primary">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-8 space-y-3">
                      <Button
                        className="w-full h-12 rounded-full text-base font-semibold shadow-lg shadow-primary/20"
                        asChild
                      >
                        <Link href="/checkout">
                          {t('checkout')}
                          <ArrowRight className="h-5 w-5 ml-2" />
                        </Link>
                      </Button>
                      <p className="text-center text-xs text-muted-foreground mt-4">
                        Shipping & taxes calculated at checkout. Free shipping
                        on orders over $50.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Promo Code */}
                <Card className="mt-6 border-none shadow-sm overflow-hidden">
                  <CardContent className="p-6">
                    <h3 className="text-sm font-semibold mb-3">Promo Code</h3>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter code"
                        className="flex-1 px-3 py-2 text-sm rounded-md bg-muted border-none focus:ring-1 focus:ring-primary outline-none"
                      />
                      <Button variant="outline" size="sm">
                        Apply
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
