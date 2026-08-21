import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { ClerkProvider } from '@clerk/nextjs';
import { QueryProvider } from '@/providers/query';
import { ThemeProvider } from '@/providers/theme';
import { MegaNavbar } from '@/components/layout/MegaNavbar';
import MainFooter from '@/components/Footer';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import '@/styles/globals.css';
import '@/styles/fonts.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'EcomStore - Premium Online Shopping',
  description:
    'Discover quality products at amazing prices. Shop electronics, food, beauty, and more.',
  keywords: ['ecommerce', 'online shopping', 'electronics', 'food', 'beauty'],
  openGraph: {
    title: 'EcomStore - Premium Online Shopping',
    description: 'Discover quality products at amazing prices.',
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ar_SA'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EcomStore - Premium Online Shopping',
    description: 'Discover quality products at amazing prices.',
  },
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as 'en' | 'ar')) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Get messages for the locale
  const messages = await getMessages();

  // Determine text direction
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased" style={{ fontFamily: 'var(--font-sans)' }}>
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_Y2xlcmsuZXhhbXBsZS5jb20k'}>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <QueryProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <div className="relative flex min-h-screen flex-col">
                  <MegaNavbar />
                  <main className="flex-1">{children}</main>
                  <MainFooter />
                </div>
              </ThemeProvider>
            </QueryProvider>
          </NextIntlClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
