'use client';

import { useQuery } from '@tanstack/react-query';
import type {
  Product,
  Category,
  ProductsResponse,
  CategoriesResponse,
  ProductFilters,
} from '@/types/product';

// Fetch all products with filters
export function useProducts(filters?: ProductFilters) {
  return useQuery<ProductsResponse>({
    queryKey: ['products', filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters?.category)
        params.set('category', filters.category.toString());
      if (filters?.search) params.set('search', filters.search);
      if (filters?.minPrice)
        params.set('minPrice', filters.minPrice.toString());
      if (filters?.maxPrice)
        params.set('maxPrice', filters.maxPrice.toString());
      if (filters?.sortBy) params.set('sortBy', filters.sortBy);
      if (filters?.page) params.set('page', filters.page.toString());
      if (filters?.limit) params.set('limit', filters.limit.toString());

      const response = await fetch(`/api/products?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Fetch single product by ID
export function useProduct(productId: number | null) {
  return useQuery<{ product: Product; relatedProducts: Product[] }>({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) throw new Error('Product ID is required');

      const response = await fetch(`/api/products/${productId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }

      return response.json();
    },
    enabled: !!productId,
    staleTime: 1000 * 60 * 5,
  });
}

// Fetch all categories
export function useCategories() {
  return useQuery<CategoriesResponse>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Featured/new products (first page, sorted by newest)
export function useNewProducts(limit = 8) {
  return useProducts({ sortBy: 'newest', limit, page: 1 });
}

// Products by category
export function useProductsByCategory(categoryId: number | null, limit = 12) {
  return useProducts(
    categoryId ? { category: categoryId, limit, page: 1 } : undefined
  );
}
