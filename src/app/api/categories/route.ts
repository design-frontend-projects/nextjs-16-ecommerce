import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Get all categories with product counts
    const categories = await prisma.categories.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    // Transform to match frontend types
    const transformedCategories = categories.map((category) => ({
      category_id: category.id,
      name: category.name,
      description: category.description,
      created_at: category.created_at?.toISOString() || '',
      products_count: category._count.products,
    }));

    return NextResponse.json({
      categories: transformedCategories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
