'use client';

import { useTranslations } from 'next-intl';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CartItem } from './CartItem';
import { useCartStore } from '@/store';
import { Link } from '@/i18n/navigation';

export function CartDrawer() {
  const t = useTranslations('cart');
  const { items, isOpen, closeCart, getSubtotal, getItemCount, clearCart } =
    useCartStore();

  const subtotal = getSubtotal();
  const itemCount = getItemCount();

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            {t('title')}
            {itemCount > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {t('empty')}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-[200px]">
              {t('emptySubtitle')}
            </p>
            <Button onClick={closeCart} asChild>
              <Link href="/products">{t('continueShopping')}</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="divide-y">
                {items.map((item) => (
                  <CartItem key={item.product.product_id} item={item} compact />
                ))}
              </div>
            </ScrollArea>

            <div className="pt-4 mt-auto">
              <Separator className="mb-4" />

              {/* Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('subtotal')}</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('shipping')}</span>
                  <span className="text-muted-foreground">
                    {t('calculatedAtCheckout')}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-semibold">
                  <span>{t('total')}</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <SheetFooter className="mt-6 flex-col gap-2 sm:flex-col">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={closeCart}
                  asChild
                >
                  <Link href="/checkout">
                    {t('checkout')}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={closeCart}
                  asChild
                >
                  <Link href="/products">{t('continueShopping')}</Link>
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
