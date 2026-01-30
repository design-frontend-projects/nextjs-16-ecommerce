import { ProductDetailClient } from '@/app/_components/ProductDetailClient';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

async function getProduct(id: string) {
  const productId = parseInt(id, 10);
  if (isNaN(productId)) return null;

  return await prisma.products.findUnique({
    where: { product_id: productId },
    include: {
      categories: true,
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;
  const product = await getProduct(id);
  const t = await getTranslations({ locale, namespace: 'product' });

  if (!product) {
    return {
      title: `Product Not Found | EcomStore`,
    };
  }

  return {
    title: `${product.name} | EcomStore`,
    description: product.description || t('details'),
    openGraph: {
      title: product.name,
      description: product.description || t('details'),
      type: 'article',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop&q=90',
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  return <ProductDetailClient id={id} />;
}
