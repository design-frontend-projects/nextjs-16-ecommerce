'use client';

import NewProducts from '@/components/features/MainPageProductsComponents/NewProducts';
import FullWidthCarousel from '@/components/features/MainPageProductsComponents/ProductCarousel';
import ProductsBrands from '@/components/features/MainPageProductsComponents/ProductsBrands';
import { AnimatedTestimonials } from '@/components/features/MainPageProductsComponents/Testimonial';
import zipLogo from '@/public/icons/zip-logo.png';
import { motion } from 'framer-motion';

import ProductsSectionTabs from '@/components/features/MainPageProductsComponents/ProductsSectionTabs';
import Image from 'next/image';
import OurCustomerCare from '../MainPageProductsComponents/OurCustomerCare';
import ProductModelCard from '../MainPageProductsComponents/ProductModelCard';
// import ProductsDataFetch from './products-data-fetch/ProductsDataFetch';

const ProductsMain = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <>
      {/* Hero Section */}
      <motion.section
        className="w-full py-4 md:py-8 lg:py-12 bg-background relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* <ProductsDataFetch /> */}
        <div className="absolute inset-0 bg-linear-to-br from-(--primary)/1 to-(--accent)/1 pointer-events-none" />
        <div className="container px-4 sm:px-6 relative z-10 max-w-full">
          <motion.div
            className="flex flex-col items-center space-y-6 text-center"
            {...fadeIn}
          >
            <FullWidthCarousel autoPlay autoPlayInterval={4000}>
              {/* Slide 1 */}
              <div className="relative h-64 sm:h-80 md:h-96 lg:h-112 w-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="text-center text-white px-4">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4">
                    Welcome to Our Platform
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl">
                    Discover amazing features and possibilities
                  </p>
                </div>
              </div>

              {/* Slide 2 */}
              <div className="relative h-64 sm:h-80 md:h-96 lg:h-112 w-full bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <div className="text-center text-white px-4">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4">
                    Build Something Great
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl">
                    Tools and resources at your fingertips
                  </p>
                </div>
              </div>

              {/* Slide 3 */}
              <div className="relative h-64 sm:h-80 md:h-96 lg:h-112 w-full from-orange-500 to-red-600 flex bg-[url('/images/1.jpg')] items-center justify-center">
                <div className="text-center text-white px-4">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4">
                    Join Our Community
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl">
                    Connect with thousands of creators worldwide
                  </p>
                </div>
              </div>

              {/* Slide 4 */}
              <div className="relative h-64 sm:h-80 md:h-96 lg:h-112 w-full bg-linear-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                <div className="text-center text-white px-4">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4">
                    Start Your Journey
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl">
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
        className="w-full py-4 md:py-8 lg:py-12 bg-card"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container px-4 sm:px-6 max-w-full">
          <NewProducts />
        </div>
        <div className="container px-4 sm:px-6 max-w-full my-4 md:my-6 lg:my-10">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
            <Image
              src={zipLogo}
              loading="lazy"
              alt="zip-logo"
              className="h-auto w-8 sm:w-10"
            />
            <h1 className="text-center font-semibold text-sm sm:text-base md:text-lg text-indigo-600">
              Own it now, up to 6 months interest free
              <span className="block sm:inline mx-0 sm:mx-1 hover:underline text-xs sm:text-sm text-indigo-900 font-medium">
                learn more
              </span>
            </h1>
          </div>
        </div>
        <div className="container px-4 sm:px-6 max-w-full">
          <ProductsSectionTabs activeTab={'msi_gs'}>
            <ProductModelCard modelTitle="MSI Model" modelUrlSlug="msi" />
          </ProductsSectionTabs>
          <ProductsSectionTabs activeTab={'msi_gle'}>
            <ProductModelCard modelTitle="Asus model" modelUrlSlug="asus" />
          </ProductsSectionTabs>
          <ProductsSectionTabs activeTab={'msi_gt'}>
            <ProductModelCard modelTitle="Dell model" modelUrlSlug="dell" />
          </ProductsSectionTabs>
          <ProductsSectionTabs activeTab={'msi_ge'}>
            <ProductModelCard modelTitle="HP model" modelUrlSlug="hp" />
          </ProductsSectionTabs>
        </div>
        <div className="container px-4 sm:px-6 max-w-full my-6 md:my-8 lg:my-12">
          <ProductsBrands />
        </div>
        <div className="container px-4 sm:px-6 max-w-full my-6 md:my-8 lg:my-12">
          <AnimatedTestimonials />
        </div>
        <div className="container px-4 sm:px-6 max-w-full my-6 md:my-8 lg:my-12">
          <OurCustomerCare />
        </div>
      </motion.section>
    </>
  );
};

export default ProductsMain;
