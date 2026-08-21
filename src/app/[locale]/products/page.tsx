import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import {
  ProductFilters,
  ProductSort,
  Pagination,
  ProductCard,
} from '@/components/products';
import { ProductGrid } from '@/components/products/ProductGrid';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { SortOption } from '@/types/product';
import { Prisma } from '@/generated/prisma/client';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'products' });

  return {
    title: `${t('title')} | EcomStore`,
    description: t('subtitle'),
  };
}

export default async function ProductsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations({ locale, namespace: 'products' });
  const tFilter = await getTranslations({ locale, namespace: 'filter' });

  // Parse query parameters
  const categoryId = resolvedSearchParams.category as string | undefined;
  const search = resolvedSearchParams.search as string | undefined;
  const minPrice = resolvedSearchParams.minPrice as string | undefined;
  const maxPrice = resolvedSearchParams.maxPrice as string | undefined;
  const sortBy = (resolvedSearchParams.sort || 'newest') as SortOption;
  const page = parseInt((resolvedSearchParams.page as string) || '1', 10);
  const limit = parseInt((resolvedSearchParams.limit as string) || '12', 10);

  // Build where clause
  const where: Prisma.productsWhereInput = {
    is_active: true,
  };

  if (categoryId) {
    where.category_id = categoryId;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (minPrice || maxPrice) {
    where.base_price = {};
    if (minPrice) {
      // @ts-ignore - Prisma decimal filtering
      where.base_price.gte = parseFloat(minPrice);
    }
    if (maxPrice) {
      // @ts-ignore - Prisma decimal filtering
      where.base_price.lte = parseFloat(maxPrice);
    }
  }

  // Build order by clause
  let orderBy: Prisma.productsOrderByWithRelationInput = { created_at: 'desc' };
  switch (sortBy) {
    case 'price_asc':
      orderBy = { base_price: 'asc' };
      break;
    case 'price_desc':
      orderBy = { base_price: 'desc' };
      break;
    case 'name_asc':
      orderBy = { name: 'asc' };
      break;
    case 'name_desc':
      orderBy = { name: 'desc' };
      break;
    case 'newest':
    default:
      orderBy = { created_at: 'desc' };
  }

  // Parallel data fetching
  const [total, products, categories] = await Promise.all([
    prisma.products.count({ where }),
    prisma.products.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        categories: true,
        inventory: true,
      },
    }),
    prisma.categories.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    }),
  ]);

  // Transform products
  const transformedProducts = products.map((product) => ({
    ...product,
    product_id: product.id,
    base_price: product.base_price?.toString() || '0',
    cost_price: '0',
    weight: product.weight?.toString() || null,
    category: product.categories
      ? {
          category_id: product.categories.id,
          name: product.categories.name,
          description: product.categories.description,
          created_at: product.categories.created_at?.toISOString() || '',
        }
      : undefined,
    inventory: product.inventory?.length
      ? {
          inventory_id: product.inventory[0].inventory_id,
          product_id: product.id,
          quantity: product.inventory.reduce(
            (sum, inv) => sum + (inv.quantity || 0),
            0
          ),
        }
      : undefined,
    created_at: product.created_at?.toISOString() || '',
    updated_at: product.updated_at?.toISOString() || '',
  }));

  // Transform categories
  const transformedCategories = categories.map((cat) => ({
    category_id: cat.id,
    name: cat.name,
    description: cat.description,
    created_at: cat.created_at?.toISOString() || '',
    products_count: cat._count.products,
  }));

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <section className="bg-muted/30 py-12 border-b">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {search
              ? `${t('searchResults')} "${search}"`
              : categoryId
                ? transformedCategories.find(
                    (c) => c.category_id.toString() === categoryId
                  )?.name
                : t('title')}
          </h1>
          <p className="text-muted-foreground">
            {total} {t('found')}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filter - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h2 className="font-semibold text-lg mb-6">{tFilter('title')}</h2>
              <ProductFilters
                categories={transformedCategories}
                minPrice={0}
                maxPrice={1000} // Dynamic max price could be fetched
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    {tFilter('title')}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[540px]">
                  <SheetHeader>
                    <SheetTitle>{tFilter('title')}</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <ProductFilters categories={transformedCategories} />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort Dropdown */}
              <div className="ml-auto">
                <ProductSort />
              </div>
            </div>

            {/* Products Grid */}
            <ProductGrid
              products={transformedProducts as any} // Type assertion due to optional undefined/null differences
              columns={3}
            />

            {/* Pagination */}
            <Pagination currentPage={page} totalPages={totalPages} />
          </div>
        </div>
      </div>
    </div>
  );
}
