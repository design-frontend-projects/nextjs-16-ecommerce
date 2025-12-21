'use client';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import ProductCard from './ProductCard';
import { NEW_PRODUCTS } from '@/core/mock/ProductsData';

type Props = {};

// Mock new products data


const NewProducts = (props: Props) => {
  return (
    <div className="relative w-full py-8 px-4">
      <div className="flex flex-row justify-between items-center w-full mb-6">
        <h4 className="text-xl font-bold text-black dark:text-white dark:hover:text-ecommerce-secondary hover:fade-in transition-colors duration-200">
          New Products
        </h4>
        <Link href="/products">
          <h4 className="text-sm font-bold text-ecommerce-primary underline dark:text-ecommerce-secondary hover:fade-in transition-colors duration-200">
            See all new products
          </h4>
        </Link>
      </div>

      <div className="w-full px-10">
        <Carousel
          opts={{
            align: 'start',
            loop: true,
            skipSnaps: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {NEW_PRODUCTS.map((product) => (
              <CarouselItem
                key={product.id}
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 hover:shadow-sm"
              >
                <ProductCard
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  discountPrice={product.discountPrice}
                  inStock={product.inStock}
                  onDetails={() => {
                    // Handle product details navigation
                    console.log('Product details:', product.id);
                  }}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

export default NewProducts;
