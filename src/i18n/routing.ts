import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'ar'],

  // Used when no locale matches
  defaultLocale: 'en',

  // The prefix for the locale in the URL
  localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];
