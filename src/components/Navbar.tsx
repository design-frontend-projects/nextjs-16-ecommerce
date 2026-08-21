'use client';
import { Menu, SearchIcon, Settings, ShoppingBasket, X, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import logo from '@/public/icons/ecommerce-logo.png';
import Image from 'next/image';
import { ThemeToggle } from './ThemeToggle';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export default function MainNavbar() {
  const [mainNavLinks] = useState<{ href: string; label: string }[]>([
    {
      href: '/laptops',
      label: 'Laptops',
    },
    {
      href: '/desktops',
      label: 'Desktops',
    },
    {
      href: '/tablets',
      label: 'Tablets',
    },
  ]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn, user, signOut } = useAuth();

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    (user?.email ? user.email.split('@')[0] : 'User');

  const handleToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/85 backdrop-blur-lg border-b border-border shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 max-w-full">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src={logo}
            alt="logo"
            loading="lazy"
            width={30}
            height={30}
          ></Image>
        </Link>

        <nav className="flex flex-row gap-4 items-center">
          {mainNavLinks &&
            mainNavLinks.map((ele) => (
              <Link
                href={ele.href}
                key={ele.href}
                className="text-sm font-medium text-ecommerce-primary dark:text-white hover:text-ecommerce-secondary transition-colors duration-200"
              >
                {ele.label}
              </Link>
            ))}

          <Button
            size={'sm'}
            variant={'outline'}
            className="border-ecommerce-primary text-ecommerce-primary dark:bg-white dark:text-ecommerce-primary p-x-2 py-1 text-xs font-bold"
          >
            Our deals
          </Button>
        </nav>

        <nav className="hidden md:flex items-center gap-3">
          {isSignedIn && (
            <Link
              href="/dashboard"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
            >
              Dashboard
            </Link>
          )}
          {isSignedIn ? (
            <>
              <span className="text-sm font-medium text-foreground">
                {displayName}
              </span>
              <button
                onClick={() => signOut()}
                className="text-sm font-medium text-destructive hover:text-destructive/80 transition-colors duration-200"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/sign-in"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
            >
              Sign In
            </Link>
          )}
          <ProductsBasket />
          <SearchBar />
          <ThemeToggle />
        </nav>

        <button
          type="button"
          className="md:hidden text-foreground hover:text-primary transition-colors duration-200"
          onClick={handleToggle}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {mobileMenuOpen && (
          <div className="fixed inset-x-0 top-16 z-50 bg-background border-b border-border shadow-lg md:hidden animate-in slide-in-from-top duration-300 max-w-full">
            <div className="container py-6 flex flex-col space-y-4 px-4 sm:px-6 max-w-full">
              <Link
                href="/settings"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
                onClick={handleToggle}
              >
                Settings
              </Link>
              {isSignedIn && (
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
                  onClick={handleToggle}
                >
                  Dashboard
                </Link>
              )}
              <div className="flex items-center justify-between">
                <Link
                  href=""
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary transition-colors duration-200"
                  onClick={handleToggle}
                >
                  <Settings className="h-5 w-5" />
                </Link>
                {isSignedIn ? (
                  <>
                    <span className="text-sm font-medium text-foreground">
                      {displayName}
                    </span>
                    <button
                      onClick={() => {
                        signOut();
                        handleToggle();
                      }}
                      className="text-sm font-medium text-destructive hover:text-destructive/80 transition-colors duration-200"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/sign-in"
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
                    onClick={handleToggle}
                  >
                    Sign In
                  </Link>
                )}
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export const ProductsBasket = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Badge
          variant="secondary"
          className="bg-ecommerce-primary text-white dark:bg-blue-600 cursor-pointer"
        >
          <ShoppingBasket />
          <span className="mx-1">22</span>
        </Badge>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Shopping Basket</SheetTitle>
          <SheetDescription>You have 22 items in your basket.</SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4 py-8">
          <div className="text-center text-muted-foreground">
            Basket summary goes here.
          </div>
        </div>
        <SheetFooter>
          <Button type="submit" className="w-full">
            Checkout
          </Button>
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export const SearchBar = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <SearchIcon className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">
              Search for products...
            </p>
          </div>
          <div className="grid gap-2">
            <Input
              id="search"
              placeholder="Type to search..."
              className="h-8"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
