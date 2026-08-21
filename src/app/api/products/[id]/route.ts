import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const product = await prisma.products.findUnique({
      where: { id },
      include: {
        categories: true,
        inventory: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Get related products from same category
    const relatedProducts = product.category_id
      ? await prisma.products.findMany({
          where: {
            category_id: product.category_id,
            id: { not: id },
            is_active: true,
          },
          take: 4,
          include: {
            categories: true,
          },
        })
      : [];

    // Transform to match frontend types
    const transformedProduct = {
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
    };

    const transformedRelated = relatedProducts.map((p) => ({
      ...p,
      product_id: p.id,
      base_price: p.base_price?.toString() || '0',
      cost_price: '0',
      weight: p.weight?.toString() || null,
      category: p.categories
        ? {
            category_id: p.categories.id,
            name: p.categories.name,
            description: p.categories.description,
            created_at: p.categories.created_at?.toISOString() || '',
          }
        : null,
      created_at: p.created_at?.toISOString() || '',
      updated_at: p.updated_at?.toISOString() || '',
    }));

    return NextResponse.json({
      product: transformedProduct,
      relatedProducts: transformedRelated,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
