import { ProductsClient } from '@/app/_components/ProductsClient';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'products' });

  return {
    title: `${t('title')} | EcomStore`,
    description: t('subtitle'),
  };
}

export default async function ProductsPage() {
  return <ProductsClient />;
}
