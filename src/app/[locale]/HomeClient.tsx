'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  CreditCard,
  Headphones,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { HeroSection } from '@/components/layout/HeroSection';
import { Link } from '@/i18n/navigation';
import { useNewProducts, useCategories } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';
import { CategoryCard } from '@/components/products/CategoryCard';
import { ProductGrid } from '@/components/products/ProductGrid';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over $50',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payment',
    description: '100% secure checkout',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: CreditCard,
    title: 'Easy Returns',
    description: '30-day return policy',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Dedicated support team',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
];

export function HomeClient() {
  const t = useTranslations();
  const { data: productsData, isLoading: productsLoading } = useNewProducts(8);
  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategories();

  return (
    <div className="flex flex-col">
      <HeroSection />

      <section className="py-8 border-b bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div
                  className={cn(
                    'h-12 w-12 rounded-full flex items-center justify-center',
                    feature.bgColor
                  )}
                >
                  <feature.icon className={cn('h-6 w-6', feature.color)} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeInUp}
              className="flex items-center justify-between mb-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-foreground">
                  {t('home.categoriesTitle')}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {t('home.categoriesSubtitle')}
                </p>
              </div>
              <Button variant="ghost" className="gap-2" asChild>
                <Link href="/products">
                  {t('home.viewAll')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

            {categoriesLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {categoriesData?.categories.map((category, index) => (
                  <motion.div
                    key={category.category_id}
                    variants={fadeInUp}
                    transition={{ delay: index * 0.1 }}
                  >
                    <CategoryCard category={category} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeInUp}
              className="flex items-center justify-between mb-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-foreground">
                  {t('home.featuredTitle')}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {t('home.featuredSubtitle')}
                </p>
              </div>
              <Button variant="ghost" className="gap-2" asChild>
                <Link href="/products">
                  {t('home.viewAll')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

            <ProductGrid
              products={productsData?.products || []}
              isLoading={productsLoading}
              columns={4}
            />
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary/90 to-primary/80 p-10 md:p-16 text-primary-foreground"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('home.newsletterTitle')}
              </h2>
              <p className="text-primary-foreground/80 mb-8">
                {t('home.newsletterSubtitle')}
              </p>

              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="rounded-full bg-white text-primary hover:bg-white/90"
                >
                  {t('home.subscribe')}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
