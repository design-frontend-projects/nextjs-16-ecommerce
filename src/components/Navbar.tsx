'use client';

import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs';
import { Menu, SearchIcon, Settings, ShoppingBasket, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
// import { useIsMobile } from '@/hooks/use-mobile';
import ThemeToggle from './ThemeToggle';
import Image from 'next/image';
import logo from '@/public/icons/ecommerce-logo.png';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
export default function MainNavbar() {
  const [mainNavLinks, setMainNavLinks] = useState<
    { href: string; label: string }[]
  >([
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
  const { isSignedIn, user } = useUser();

  const handleToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-(--background)/85 backdrop-blur-lg border-b border-(--border) shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 max-w-full">
        <Link href="/" className="flex items-center space-x-2">
          {/* <span className="text-xl sm:text-2xl font-bold font-poppins bg-linear-to-r from-(--primary) to-(--accent) bg-clip-text text-transparent">
            NextBoiler
          </span> */}
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
              className="text-sm font-medium text-(--foreground) hover:text-(--primary) transition-colors duration-200"
            >
              Dashboard
            </Link>
          )}
          {isSignedIn ? (
            <>
              <span className="text-sm font-medium text-(--foreground)">
                {user?.firstName + '' + user?.lastName ||
                  user?.emailAddresses[0].emailAddress}
              </span>
              <SignOutButton>
                <button className="text-sm font-medium text-(--foreground) hover:text-(--primary) transition-colors duration-200">
                  Sign Out
                </button>
              </SignOutButton>
            </>
          ) : (
            <SignInButton mode="modal">
              <button className="text-sm font-medium text-(--foreground) hover:text-(--primary) transition-colors duration-200">
                Sign In
              </button>
            </SignInButton>
          )}
          <Badge
            variant="secondary"
            className="bg-ecommerce-primary text-white dark:bg-blue-600"
          >
            <ShoppingBasket />
            <span className="mx-1">22</span>
          </Badge>
          <SearchIcon />
          <ThemeToggle />
        </nav>

        <button
          type="button"
          className="md:hidden text-(--foreground) hover:text-(--primary) transition-colors duration-200"
          onClick={handleToggle}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {mobileMenuOpen && (
          <div className="fixed inset-x-0 top-16 z-50 bg-(--background) border-b border-(--border) shadow-lg md:hidden animate-in slide-in-from-top duration-300 max-w-full">
            <div className="container py-6 flex flex-col space-y-4 px-4 sm:px-6 max-w-full">
              <Link
                href="/settings"
                className="text-sm font-medium text-(--foreground) hover:text-(--primary) transition-colors duration-200"
                onClick={handleToggle}
              >
                Settings
              </Link>
              {isSignedIn && (
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-(--foreground) hover:text-(--primary) transition-colors duration-200"
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
                  className="text-(--foreground) hover:text-(--primary) transition-colors duration-200"
                  onClick={handleToggle}
                >
                  <Settings className="h-5 w-5" />
                </Link>
                {isSignedIn ? (
                  <>
                    <span className="text-sm font-medium text-(--foreground)">
                      {user?.firstName || user?.emailAddresses[0].emailAddress}
                    </span>
                    <SignOutButton>
                      <button className="text-sm font-medium text-(--foreground) hover:text-(--primary) transition-colors duration-200">
                        Sign Out
                      </button>
                    </SignOutButton>
                  </>
                ) : (
                  <SignInButton mode="modal">
                    <button className="text-sm font-medium text-(--foreground) hover:text-(--primary) transition-colors duration-200">
                      Sign In
                    </button>
                  </SignInButton>
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
