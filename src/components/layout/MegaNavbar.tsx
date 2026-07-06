'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, ShoppingCart, Heart, Globe, X } from 'lucide-react';
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SearchBar } from '@/components/search/SearchBar';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link, useRouter, usePathname } from '@/i18n/navigation';
import { useCartStore, useFavoritesStore } from '@/store';
import { useCategories } from '@/hooks/useProducts';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';

const navLinkClass = cn(
  'px-3 py-2 text-sm font-medium',
  'hover:bg-accent hover:text-accent-foreground',
  'rounded-md transition-colors'
);

export function MegaNavbar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <NavbarFallback />;
  }

  return <NavbarInteractive />;
}

function NavbarFallback() {
  const t = useTranslations('nav');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-black dark:bg-white flex items-center justify-center">
              <span className="text-white dark:text-black font-bold text-lg">E</span>
            </div>
            <span className="font-bold text-xl">EcomStore</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/favorites"><Heart className="h-5 w-5" /></Link>
            </Button>
            <Button variant="ghost" size="icon" disabled>
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/sign-in">{t('signIn')}</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/sign-up">{t('signUp')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavbarInteractive() {
  const t = useTranslations('nav');
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: categoriesData } = useCategories();
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const openCart = useCartStore((state) => state.openCart);
  const favoritesCount = useFavoritesStore((state) =>
    state.getFavoritesCount()
  );

  const handleLocaleChange = (locale: string) => {
    router.replace(pathname, { locale });
  };

  const categories = categoriesData?.categories || [];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-black dark:bg-white flex items-center justify-center">
                <span className="text-white dark:text-black font-bold text-lg">E</span>
              </div>
              <span className="font-bold text-xl">EcomStore</span>
            </Link>

            <nav className="hidden lg:flex items-center space-x-1">
              <Link
                href="/"
                className={cn(navLinkClass, isActive('/') && 'bg-primary text-primary-foreground')}
              >
                {t('home')}
              </Link>
              <Link
                href="/products"
                className={cn(navLinkClass, isActive('/products') && 'bg-primary text-primary-foreground')}
              >
                {t('products')}
              </Link>
            </nav>

            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <SearchBar className="w-full" />
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden sm:flex">
                    <Globe className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {routing.locales.map((locale) => (
                    <DropdownMenuItem
                      key={locale}
                      onClick={() => handleLocaleChange(locale)}
                    >
                      {locale === 'en' ? '🇺🇸 English' : '🇸🇦 العربية'}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <ThemeToggle />

              <Button variant="ghost" size="icon" asChild>
                <Link href="/favorites">
                  <Heart className="h-5 w-5" />
                  {favoritesCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs flex items-center justify-center">
                      {favoritesCount}
                    </span>
                  )}
                </Link>
              </Button>

              <Button variant="ghost" size="icon" onClick={openCart}>
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>

              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: 'h-8 w-8',
                    },
                  }}
                />
              </SignedIn>
              <SignedOut>
                <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                  <Link href="/sign-in">{t('signIn')}</Link>
                </Button>
                <Button size="sm" asChild className="hidden sm:flex">
                  <Link href="/sign-up">{t('signUp')}</Link>
                </Button>
              </SignedOut>

              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(true)}>
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
          <div className="flex items-center justify-between px-4 py-4 border-b">
            <Link href="/" className="font-bold text-xl">EcomStore</Link>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex flex-col p-4 gap-2">
            <Link
              href="/"
              className={cn(navLinkClass, isActive('/') && 'bg-primary text-primary-foreground')}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('home')}
            </Link>
            <Link
              href="/products"
              className={cn(navLinkClass, isActive('/products') && 'bg-primary text-primary-foreground')}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('products')}
            </Link>
            {categories.map((category) => (
              <Link
                key={category.category_id}
                href={`/products?category=${category.category_id}`}
                className={cn(navLinkClass, 'justify-start capitalize')}
                onClick={() => setMobileMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t">
            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                  {t('signIn')}
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                  {t('signUp')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      <CartDrawer />
    </>
  );
}