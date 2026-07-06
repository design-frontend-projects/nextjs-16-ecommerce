'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, Truck, ShieldCheck, CreditCard, Headphones } from 'lucide-react';
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
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payment',
    description: '100% secure checkout',
  },
  {
    icon: CreditCard,
    title: 'Easy Returns',
    description: '30-day return policy',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Dedicated support team',
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

      <section className="py-12 border-b">
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
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-accent">
                  <feature.icon className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground">{feature.title}</h3>
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
                  <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('home.newsletterTitle')}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('home.newsletterSubtitle')}
            </p>

            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button
                type="submit"
                size="lg"
                className="rounded-xl"
              >
                {t('home.subscribe')}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}