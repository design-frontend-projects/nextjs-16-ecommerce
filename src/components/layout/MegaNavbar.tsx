'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Menu,
  ShoppingCart,
  Heart,
  User,
  ChevronDown,
  Globe,
  X,
} from 'lucide-react';
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SearchBar } from '@/components/search/SearchBar';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link, useRouter, usePathname } from '@/i18n/navigation';
import { useCartStore, useFavoritesStore } from '@/store';
import { useCategories } from '@/hooks/useProducts';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';

export function MegaNavbar() {
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

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  E
                </span>
              </div>
              <span className="font-bold text-xl hidden sm:block">
                EcomStore
              </span>
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/"
                      className={cn(
                        'group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50'
                      )}
                    >
                      {t('home')}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Categories Mega Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    {t('categories')}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[400px] lg:w-[500px] lg:grid-cols-2">
                      <div className="col-span-2 pb-3 border-b">
                        <Link
                          href="/products"
                          className="text-sm font-medium hover:text-primary transition-colors"
                        >
                          {t('allCategories')} →
                        </Link>
                      </div>
                      {categories.map((category) => (
                        <Link
                          key={category.category_id}
                          href={`/products?category=${category.category_id}`}
                          className="group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none capitalize">
                            {category.name}
                          </div>
                          <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                            {category.description ||
                              `Browse ${category.name} products`}
                          </p>
                          {category.products_count !== undefined && (
                            <span className="text-xs text-primary">
                              {category.products_count} products
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/products"
                      className={cn(
                        'group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50'
                      )}
                    >
                      {t('products')}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <SearchBar className="w-full" />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Language Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden sm:flex"
                  >
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

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Favorites */}
              <Button variant="ghost" size="icon" className="relative" asChild>
                <Link href="/favorites">
                  <Heart className="h-5 w-5" />
                  {favoritesCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {favoritesCount}
                    </span>
                  )}
                </Link>
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={openCart}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>

              {/* User Menu */}
              <SignedIn>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <UserButton
                        appearance={{
                          elements: {
                            avatarBox: 'h-8 w-8',
                          },
                        }}
                      />
                    </Button>
                  </DropdownMenuTrigger>
                </DropdownMenu>
              </SignedIn>
              <SignedOut>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:flex"
                  asChild
                >
                  <Link href="/sign-in">{t('signIn')}</Link>
                </Button>
                <Button size="sm" className="hidden sm:flex" asChild>
                  <Link href="/sign-up">{t('signUp')}</Link>
                </Button>
              </SignedOut>

              {/* Mobile Menu Trigger */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col gap-4 mt-6">
                    {/* Mobile Search */}
                    <SearchBar className="mb-4" />

                    {/* Mobile Navigation Links */}
                    <nav className="flex flex-col gap-2">
                      <Link
                        href="/"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t('home')}
                      </Link>
                      <Link
                        href="/products"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t('products')}
                      </Link>

                      {/* Categories */}
                      <div className="px-3 py-2">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          {t('categories')}
                        </span>
                      </div>
                      {categories.map((category) => (
                        <Link
                          key={category.category_id}
                          href={`/products?category=${category.category_id}`}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors capitalize ml-2"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </nav>

                    <div className="border-t pt-4 mt-4">
                      {/* Language & Auth for Mobile */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-muted-foreground">
                          Language
                        </span>
                        <div className="flex gap-2">
                          {routing.locales.map((locale) => (
                            <Button
                              key={locale}
                              variant="outline"
                              size="sm"
                              onClick={() => handleLocaleChange(locale)}
                            >
                              {locale.toUpperCase()}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <SignedOut>
                        <div className="flex flex-col gap-2">
                          <Button asChild>
                            <Link
                              href="/sign-in"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {t('signIn')}
                            </Link>
                          </Button>
                          <Button variant="outline" asChild>
                            <Link
                              href="/sign-up"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {t('signUp')}
                            </Link>
                          </Button>
                        </div>
                      </SignedOut>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
