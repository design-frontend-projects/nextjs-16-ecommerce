'use client';

import { motion } from 'framer-motion';
import NewProducts from '@/components/features/MainPageProducts/NewProducts';
import Link from 'next/link';
import ProductsBrands from '@/components/features/MainPageProducts/ProductsBrands';
import { AnimatedTestimonials } from '@/components/features/MainPageProducts/Testimonial';
import FullWidthCarousel from '@/components/features/MainPageProducts/ProductCarousel';

type Props = {};

const ProductsMain = (props: Props) => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <>
      {/* Hero Section */}
      <motion.section
        className="w-full py-2 sm:py-16 md:py-24 lg:py-8 bg-background relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-linear-to-br from-(--primary)/1 to-(--accent)/1 pointer-events-none" />
        <div className="container px-4 sm:px-6 relative z-10 max-w-full">
          <motion.div
            className="flex flex-col items-center space-y-6 text-center"
            {...fadeIn}
          >
            <FullWidthCarousel autoPlay autoPlayInterval={4000}>
              {/* Slide 1 */}
              <div className="relative h-150 w-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="text-center text-white px-4">
                  <h1 className="text-5xl font-bold mb-4">
                    Welcome to Our Platform
                  </h1>
                  <p className="text-xl">
                    Discover amazing features and possibilities
                  </p>
                </div>
              </div>

              {/* Slide 2 */}
              <div className="relative h-150 w-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <div className="text-center text-white px-4">
                  <h1 className="text-5xl font-bold mb-4">
                    Build Something Great
                  </h1>
                  <p className="text-xl">
                    Tools and resources at your fingertips
                  </p>
                </div>
              </div>

              {/* Slide 3 */}
              <div className="relative h-150 w-full from-orange-500 to-red-600 flex bg-[url('/images/1.jpg')] items-center justify-center">
                <div className="text-center text-white px-4 ">
                  <h1 className="text-5xl font-bold mb-4">
                    Join Our Community
                  </h1>
                  <p className="text-xl">
                    Connect with thousands of creators worldwide
                  </p>
                </div>
              </div>

              {/* Slide 4 */}
              <div className="relative h-150 w-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                <div className="text-center text-white px-4">
                  <h1 className="text-5xl font-bold mb-4">
                    Start Your Journey
                  </h1>
                  <p className="text-xl">
                    Everything you need to succeed is here
                  </p>
                </div>
              </div>
            </FullWidthCarousel>
          </motion.div>
        </div>
      </motion.section>
      {/* Features Section */}
      <motion.section
        className="w-full py-2 sm:py-16 md:py-24 bg-(--card)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container px-4 sm:px-6 max-w-full">
          <NewProducts />
        </div>
        <div className="py-3">
          <h1 className="text-center font-semibold text-base text-indigo-700">
            own it now, up to 6 months interest free
            <span className="mx-1 underline text-sm text-indigo-500 font-medium">
              learn more
            </span>
          </h1>
        </div>
        <div className="w-full relative grid grid-cols-12 gap-4">
          <div className="col-span-3 static">side items</div>
          <div className="col-span-9">
            produc card
            <Link href={'products'}>Product ctalog</Link>
          </div>
        </div>
        <div className="my-6">
          <ProductsBrands />
        </div>
        <div className="my-6">
          <AnimatedTestimonials />
        </div>
      </motion.section>
    </>
  );
};

export default ProductsMain;
