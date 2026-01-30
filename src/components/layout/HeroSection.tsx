'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Link } from '@/i18n/navigation';
import type { Product } from '@/types/product';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  products?: Product[];
  className?: string;
}

const heroSlides = [
  {
    title: 'Discover Quality Products',
    subtitle:
      'Shop the latest trends and enjoy amazing deals on our curated collection',
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop&q=80',
    cta: 'Shop Now',
    ctaLink: '/products',
    gradient: 'from-violet-900/90 via-purple-900/80 to-transparent',
  },
  {
    title: 'New Electronics Collection',
    subtitle: 'Explore cutting-edge technology at unbeatable prices',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&h=1080&fit=crop&q=80',
    cta: 'Explore Tech',
    ctaLink: '/products?category=3',
    gradient: 'from-blue-900/90 via-cyan-900/80 to-transparent',
  },
  {
    title: 'Fresh & Organic',
    subtitle: 'Premium quality food and fruits delivered to your doorstep',
    image:
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1920&h=1080&fit=crop&q=80',
    cta: 'Shop Fresh',
    ctaLink: '/products?category=1',
    gradient: 'from-green-900/90 via-emerald-900/80 to-transparent',
  },
];

export function HeroSection({ products, className }: HeroSectionProps) {
  const t = useTranslations('hero');

  return (
    <section className={cn('relative w-full', className)}>
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {heroSlides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[500px] sm:h-[600px] lg:h-[700px] w-full overflow-hidden">
                {/* Background Image */}
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  className="object-cover"
                  sizes="100vw"
                />

                {/* Gradient Overlay */}
                <div
                  className={cn(
                    'absolute inset-0 bg-gradient-to-r',
                    slide.gradient
                  )}
                />

                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="max-w-2xl text-white"
                    >
                      {/* Badge */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
                      >
                        <Sparkles className="h-4 w-4 text-amber-300" />
                        <span className="text-sm font-medium">
                          {index === 0
                            ? 'New Collection'
                            : `Featured ${index + 1}`}
                        </span>
                      </motion.div>

                      {/* Title */}
                      <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
                      >
                        {slide.title}
                      </motion.h1>

                      {/* Subtitle */}
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-lg sm:text-xl text-white/90 mb-8 max-w-xl"
                      >
                        {slide.subtitle}
                      </motion.p>

                      {/* CTA Buttons */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="flex flex-wrap gap-4"
                      >
                        <Button
                          size="lg"
                          className="rounded-full text-base px-8 bg-white text-foreground hover:bg-white/90"
                          asChild
                        >
                          <Link href={slide.ctaLink}>
                            {slide.cta}
                            <ArrowRight className="h-5 w-5 ml-2" />
                          </Link>
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          className="rounded-full text-base px-8 border-white/30 text-white hover:bg-white/10"
                          asChild
                        >
                          <Link href="/products">{t('exploreCta')}</Link>
                        </Button>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows */}
        <CarouselPrevious className="left-4 sm:left-8 h-12 w-12 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" />
        <CarouselNext className="right-4 sm:right-8 h-12 w-12 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" />
      </Carousel>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
}
