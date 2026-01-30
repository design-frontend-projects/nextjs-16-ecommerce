'use client';

import { useUser, SignOutButton } from '@clerk/nextjs';
import { useTranslations } from 'next-intl';
import {
  User,
  Package,
  MapPin,
  Heart,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const t = useTranslations('profile');

  if (!isLoaded) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="container mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-sm overflow-hidden">
              <CardContent className="p-6 text-center">
                <div className="relative h-24 w-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary/10">
                  <Image
                    src={
                      user?.imageUrl ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&q=80'
                    }
                    alt={user?.fullName || 'User'}
                    fill
                    className="object-cover"
                  />
                </div>
                <h2 className="text-xl font-bold">{user?.fullName}</h2>
                <p className="text-sm text-muted-foreground">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verified Account
                </div>
              </CardContent>
              <Separator />
              <div className="p-2">
                <ProfileLink
                  href="/profile"
                  icon={<User className="h-4 w-4" />}
                  label={t('personalInfo')}
                  active
                />
                <ProfileLink
                  href="/orders"
                  icon={<Package className="h-4 w-4" />}
                  label={t('orderHistory')}
                />
                <ProfileLink
                  href="/favorites"
                  icon={<Heart className="h-4 w-4" />}
                  label={t('wishlist')}
                />
                <ProfileLink
                  href="/profile/addresses"
                  icon={<MapPin className="h-4 w-4" />}
                  label={t('addresses')}
                />
                <ProfileLink
                  href="/profile/settings"
                  icon={<Settings className="h-4 w-4" />}
                  label={t('settings')}
                />

                <div className="mt-4 pt-4 border-t px-4 pb-4">
                  <SignOutButton>
                    <button className="flex items-center gap-3 text-sm font-medium text-destructive hover:text-destructive/80 transition-colors w-full">
                      <LogOut className="h-4 w-4" />
                      {t('signOut')}
                    </button>
                  </SignOutButton>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-6"
            >
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>{t('personalInfo')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        First Name
                      </label>
                      <p className="font-medium">{user?.firstName}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Last Name
                      </label>
                      <p className="font-medium">{user?.lastName}</p>
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Email Address
                      </label>
                      <p className="font-medium">
                        {user?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 rounded-full"
                  >
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-none shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-bold">
                      Recent Order
                    </CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Order #ORD-2948</p>
                      <p className="text-xs text-muted-foreground">
                        Placed on Dec 12, 2024
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                          Processing
                        </span>
                        <span className="font-bold">$124.00</span>
                      </div>
                    </div>
                    <Button
                      variant="link"
                      className="p-0 h-auto mt-4 text-xs"
                      asChild
                    >
                      <Link href="/orders">
                        View all orders <ChevronRight className="h-3 w-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-bold">
                      Default Address
                    </CardTitle>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Home</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        123 Luxury Avenue, Suite 405
                        <br />
                        Manhattan, NY 10001
                        <br />
                        United States
                      </p>
                    </div>
                    <Button
                      variant="link"
                      className="p-0 h-auto mt-4 text-xs"
                      asChild
                    >
                      <Link href="/profile/addresses">
                        Manage addresses <ChevronRight className="h-3 w-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileLink({
  href,
  icon,
  label,
  active = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
        active
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
    >
      {icon}
      {label}
      <ChevronRight
        className={cn(
          'ml-auto h-4 w-4 transition-transform',
          active ? 'rotate-0' : '-rotate-90'
        )}
      />
    </Link>
  );
}
