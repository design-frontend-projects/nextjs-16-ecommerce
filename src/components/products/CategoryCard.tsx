'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import type { Category } from '@/types/product';

interface CategoryCardProps {
  category: Category;
  className?: string;
}

// Map category names to Unsplash images
const categoryImages: Record<string, string> = {
  food: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=300&fit=crop&q=80',
  fruites:
    'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=300&fit=crop&q=80',
  electronic:
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop&q=80',
  beauty:
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop&q=80',
  default:
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&q=80',
};

export function CategoryCard({ category, className }: CategoryCardProps) {
  const imageUrl =
    categoryImages[category.name.toLowerCase()] || categoryImages.default;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className={className}
    >
      <Link href={`/products?category=${category.category_id}`}>
        <div className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300">
          {/* Background Image */}
          <div className="relative aspect-[4/3]">
            <Image
              src={imageUrl}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="text-xl font-bold text-white capitalize mb-1">
              {category.name}
            </h3>
            {category.products_count !== undefined && (
              <p className="text-white/80 text-sm">
                {category.products_count}{' '}
                {category.products_count === 1 ? 'product' : 'products'}
              </p>
            )}
          </div>

          {/* Hover Effect */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-2xl transition-colors duration-300" />
        </div>
      </Link>
    </motion.div>
  );
}
