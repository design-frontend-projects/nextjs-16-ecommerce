import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://ecommerce.example.com';

  // Static pages
  const routes = ['', '/products', '/about', '/contact'];

  const staticEntries: MetadataRoute.Sitemap = routes.flatMap((route) =>
    routing.locales.map((locale: string) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: route === '' ? 1 : 0.8,
    }))
  );

  return staticEntries;
}
