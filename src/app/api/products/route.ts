import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { SortOption } from '@/types/product';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const categoryId = searchParams.get('category');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = (searchParams.get('sortBy') || 'newest') as SortOption;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);

    // Build where clause
    const where: Record<string, unknown> = {
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
        (where.base_price as Record<string, unknown>).gte =
          parseFloat(minPrice);
      }
      if (maxPrice) {
        (where.base_price as Record<string, unknown>).lte =
          parseFloat(maxPrice);
      }
    }

    // Build order by clause
    let orderBy: Record<string, string> = { created_at: 'desc' };
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

    // Get total count for pagination
    const total = await prisma.products.count({ where });

    // Get products with pagination
    const products = await prisma.products.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        categories: true,
        inventory: true,
      },
    });

    // Transform products to match frontend types
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
        : null,
      inventory: product.inventory?.length
        ? {
            inventory_id: product.inventory[0].inventory_id,
            product_id: product.id,
            quantity: product.inventory.reduce(
              (sum, inv) => sum + (inv.quantity || 0),
              0
            ),
          }
        : null,
      created_at: product.created_at?.toISOString() || '',
      updated_at: product.updated_at?.toISOString() || '',
    }));

    return NextResponse.json({
      products: transformedProducts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
