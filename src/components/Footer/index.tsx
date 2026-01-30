'use client';

import { useTranslations } from 'next-intl';
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function MainFooter() {
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  E
                </span>
              </div>
              <span className="font-bold text-xl">EcomStore</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              {t('description')}
            </p>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Instagram className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg uppercase tracking-wider text-foreground">
              {t('quickLinks')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {t('allProducts')}
                </Link>
              </li>
              <li>
                <Link
                  href="/favorites"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {t('wishlist')}
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {t('myAccount')}
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {t('trackOrder')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg uppercase tracking-wider text-foreground">
              {t('support')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {t('aboutUs')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {t('contactUs')}
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {t('faq')}
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {t('shippingPolicy')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg uppercase tracking-wider text-foreground">
              {t('getInTouch')}
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span className="text-muted-foreground text-sm leading-relaxed">
                  {t('address')}
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span className="text-muted-foreground text-sm">
                  +1 (234) 567-890
                </span>
              </li>
              <li className="flex gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span className="text-muted-foreground text-sm">
                  support@ecomstore.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-10 opacity-50" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-muted-foreground order-2 md:order-1">
            © {currentYear} EcomStore. {t('allRightsReserved')}
          </p>
          <div className="flex items-center gap-6 order-1 md:order-2">
            <Link
              href="/privacy"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              {t('privacyPolicy')}
            </Link>
            <Link
              href="/terms"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              {t('termsOfService')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
