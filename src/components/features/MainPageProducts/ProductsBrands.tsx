'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React, { useState, useCallback } from 'react';
import pclogo1 from '@/public/images/pc-company/pc-logo1.png';
import pclogo2 from '@/public/images/pc-company/pc-logo2.png';
import pclogo3 from '@/public/images/pc-company/pc-logo3.png';
import pclogo4 from '@/public/images/pc-company/pc-logo4.png';
import pclogo5 from '@/public/images/pc-company/pc-logo5.png';

type Props = {};

const ProductsBrands = (props: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const productCompanyLogo = [
    { src: pclogo1, alt: 'Brand 1' },
    { src: pclogo2, alt: 'Brand 2' },
    { src: pclogo3, alt: 'Brand 3' },
    { src: pclogo4, alt: 'Brand 4' },
    { src: pclogo5, alt: 'Brand 5' },
  ];

  // Responsive items per slide
  const getItemsPerSlide = () => {
    if (typeof window === 'undefined') return 1;
    const width = window.innerWidth;
    if (width < 640) return 1; // mobile
    if (width < 768) return 2; // small tablet
    if (width < 1024) return 3; // tablet
    return 5; // desktop (all items)
  };

  const [itemsPerSlide, setItemsPerSlide] = React.useState(getItemsPerSlide());

  React.useEffect(() => {
    const handleResize = () => setItemsPerSlide(getItemsPerSlide());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = Math.ceil(productCompanyLogo.length / itemsPerSlide);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  }, [totalSlides]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  }, [totalSlides]);

  const currentItems = productCompanyLogo.slice(
    currentIndex * itemsPerSlide,
    (currentIndex + 1) * itemsPerSlide
  );

  return (
    <div className="relative w-full">
      {/* Carousel Container */}
      <div className="overflow-hidden">
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8 px-4 py-4 w-full">
            {currentItems.map((logo) => (
              <div
                key={logo.alt}
                className="flex items-center justify-center h-20 sm:h-24 md:h-28 bg-card rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={120}
                  height={60}
                  loading="lazy"
                  className="w-full h-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Buttons - Hide on desktop when all items fit */}
      {totalSlides > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background md:left-4"
            onClick={goToPrevious}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background md:right-4"
            onClick={goToNext}
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'h-2 w-2 rounded-full transition-all',
                  currentIndex === index
                    ? 'bg-foreground w-8'
                    : 'bg-foreground/30 hover:bg-foreground/50'
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductsBrands;
