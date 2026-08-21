'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, ShoppingCart, Heart, Globe, X, User as UserIcon, LogOut, Package, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
  const { user, isSignedIn, isAdmin, signOut, isLoading } = useAuth();

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

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    (user?.email ? user.email.split('@')[0] : 'Account');

  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const initials = (displayName[0] || 'U').toUpperCase();

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

              {!isLoading && (
                <>
                  {isSignedIn ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={avatarUrl} alt={displayName} />
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{displayName}</p>
                            <p className="text-xs leading-none text-muted-foreground truncate">
                              {user?.email}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem asChild>
                            <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                              <UserIcon className="h-4 w-4" />
                              <span>{t('profile')}</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/orders" className="flex items-center gap-2 cursor-pointer">
                              <Package className="h-4 w-4" />
                              <span>{t('orders')}</span>
                            </Link>
                          </DropdownMenuItem>
                          {isAdmin && (
                            <DropdownMenuItem asChild>
                              <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                                <Shield className="h-4 w-4 text-amber-500" />
                                <span>Dashboard</span>
                              </Link>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive cursor-pointer flex items-center gap-2"
                          onClick={() => signOut()}
                        >
                          <LogOut className="h-4 w-4" />
                          <span>{t('signOut')}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <div className="hidden sm:flex items-center gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/sign-in">{t('signIn')}</Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link href="/sign-up">{t('signUp')}</Link>
                      </Button>
                    </div>
                  )}
                </>
              )}

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
            {isSignedIn ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 px-2 py-1">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={avatarUrl} alt={displayName} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col truncate">
                    <span className="text-sm font-semibold">{displayName}</span>
                    <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
                  </div>
                </div>
                <Button variant="outline" asChild onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/profile">{t('profile')}</Link>
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                >
                  {t('signOut')}
                </Button>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      )}

      <CartDrawer />
    </>
  );
}