'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  className?: string;
}

const heroImages = [
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&h=1080&fit=crop&q=80',
  'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1920&h=1080&fit=crop&q=80',
];

export function HeroSection({ className }: HeroSectionProps) {
  const t = useTranslations('hero');

  return (
    <section className={cn('relative w-full', className)}>
      <div className="relative h-[60vh] sm:h-[70vh] lg:h-[80vh] w-full overflow-hidden">
        <Image
          src={heroImages[0]}
          alt={t('title')}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-background/95" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                {t('title')}
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
                {t('subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="rounded-xl" asChild>
                  <Link href="/products">
                    {t('cta')}
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}