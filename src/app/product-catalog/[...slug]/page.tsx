'use client';
import AppBreadCrumb from '@/components/CustomUI/AppBreadCrumb';
import FullWidthCarousel from '@/components/features/MainPageProductsComponents/ProductCarousel';
import FilterSidebar from '@/components/features/MainPageProductsComponents/FilterSidebar';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Grid2X2, List } from 'lucide-react';
import ProductCard from '@/components/features/MainPageProductsComponents/ProductCard';
import { NEW_PRODUCTS } from '@/core/mock/ProductsData';
import OurCustomerCare from '@/components/features/MainPageProductsComponents/OurCustomerCare';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useMediaQuery } from '@/hooks';
import { useParams } from 'next/navigation';

const ProductCatalog = () => {
  const mediaQuery = useMediaQuery('(min-width: 768px)');
  const [gridOrList, setGidList] = useState<'grid' | 'list'>('grid');
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const slug = useParams().slug;

  // Initial filter state
  const initialFilters = [
    {
      title: 'Category',
      options: [
        { id: 'laptops', label: 'Laptops', checked: true },
        { id: 'desktops', label: 'Desktops', checked: false },
        { id: 'monitors', label: 'Monitors', checked: false },
        { id: 'accessories', label: 'Accessories', checked: false },
      ],
      type: 'checkbox' as const,
    },
    {
      title: 'Price Range',
      options: [],
      type: 'range' as const,
      rangeValue: [0, 1000],
    },
    {
      title: 'Brand',
      options: [
        { id: 'msi', label: 'MSI', checked: true },
        { id: 'asus', label: 'ASUS', checked: false },
        { id: 'dell', label: 'Dell', checked: false },
        { id: 'hp', label: 'HP', checked: false },
      ],
      type: 'checkbox' as const,
    },
    {
      title: 'Availability',
      options: [
        { id: 'instock', label: 'In Stock', checked: true },
        { id: 'preorder', label: 'Pre-order', checked: false },
      ],
      type: 'checkbox' as const,
    },
  ];

  const productsData = [
    {
      id: '1',
      title: 'MSI Pro 16 Flex - 036AU',
      description: '15.6" MULTITOUCH All-In-One PC',
      price: 499.0,
      stockStatus: 'in stock' as const,
      badge: 'EX DISPLAY',
      badgeColor: 'destructive' as const,
    },
    {
      id: '2',
      title: 'MSI Pro 16 Flex - 037AU',
      description: '15.6" MULTITOUCH All-In-One PC',
      price: 529.0,
      stockStatus: 'in stock' as const,
    },
    {
      id: '3',
      title: 'MSI Pro 16 Flex - 038AU',
      description: '15.6" MULTITOUCH All-In-One PC',
      price: 479.0,
      stockStatus: 'in stock' as const,
      badge: 'SALE',
      badgeColor: 'secondary' as const,
    },
    {
      id: '4',
      title: 'MSI Pro 16 Flex - 039AU',
      description: '15.6" MULTITOUCH All-In-One PC',
      price: 549.0,
      stockStatus: 'in stock' as const,
    },
    {
      id: '5',
      title: 'MSI Pro 16 Flex - 040AU',
      description: '15.6" MULTITOUCH All-In-One PC',
      price: 599.0,
      stockStatus: 'in stock' as const,
      badge: 'HOT',
      badgeColor: 'default' as const,
    },
    {
      id: '6',
      title: 'MSI Pro 16 Flex - 041AU',
      description: '15.6" MULTITOUCH All-In-One PC',
      price: 519.0,
      stockStatus: 'limited stock' as const,
    },
    {
      id: '7',
      title: 'MSI Pro 16 Flex - 042AU',
      description: '15.6" MULTITOUCH All-In-One PC',
      price: 569.0,
      stockStatus: 'in stock' as const,
    },
    {
      id: '8',
      title: 'MSI Pro 16 Flex - 043AU',
      description: '15.6" MULTITOUCH All-In-One PC',
      price: 489.0,
      stockStatus: 'out of stock' as const,
    },
    {
      id: '9',
      title: 'MSI Pro 16 Flex - 044AU',
      description: '15.6" MULTITOUCH All-In-One PC',
      price: 539.0,
      stockStatus: 'in stock' as const,
    },
  ];

  const [filters, setFilters] = useState(initialFilters);
  const [filteredProducts, setFilteredProducts] = useState(productsData);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  // Handle filter checkbox changes
  const handleFilterChange = (groupId: string, optionId: string) => {
    setFilters((prevFilters) => {
      return prevFilters.map((group) => {
        if (group.title === groupId && group.type === 'checkbox') {
          return {
            ...group,
            options: group.options.map((option) => {
              if (option.id === optionId) {
                return { ...option, checked: !option.checked };
              }
              return option;
            }),
          };
        }
        return group;
      });
    });
  };

  // Handle price range changes
  const handleRangeChange = (groupId: string, value: number[]) => {
    setFilters((prevFilters) => {
      return prevFilters.map((group) => {
        if (group.title === groupId && group.type === 'range') {
          return { ...group, rangeValue: value };
        }
        return group;
      });
    });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
  };

  const toggleView = (view: 'grid' | 'list') => {
    console.log('view: ', view);
    setGidList(view);
  };

  return (
    <motion.section
      className="w-full py-4 md:py-8 lg:py-12 bg-background relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
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
            <div className="relative h-64 sm:h-80 md:h-96 lg:h-[28rem] w-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
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
            <div className="relative h-64 sm:h-80 md:h-96 lg:h-[28rem] w-full from-orange-500 to-red-600 flex bg-[url('/images/1.jpg')] items-center justify-center">
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
            <div className="relative h-64 sm:h-80 md:h-96 lg:h-[28rem] w-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
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
      <div className="after-main w-full mb-4 container px-4 sm:px-6 sm:my-6 relative">
        <AppBreadCrumb />
        <h1 className="py-4 my-6 sm:my-4 text-2xl font-bold text-black">
          MSI GL Products {slug}
        </h1>
      </div>
      <div className="px-4 sm:px-6 relative py-4 w-full grid grid-cols-12 gap-4">
        <div className="col-span-3">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onRangeChange={handleRangeChange}
            onResetFilters={handleResetFilters}
          />
        </div>
        <div className="col-span-9">
          <div className="main-filter flex xs:flex-col lg:flex-row justify-between items-center mb-4">
            <div className="lg:flex-3 md:flex-3 xs:flex-1">
              <h6 className="text-xs font-medium text-slate-400">
                Items 15-50 of 60
              </h6>
            </div>
            <div className="filter-layout-wrapper w-full flex flex-row justify-end items-center flex-1">
              <div className="options-wrapper flex lg:flex-row xs:flex-col xs:items-start lg:items-center gap-2 mx-2 sm:w-full">
                <Select>
                  <SelectTrigger className="w-45">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent className="border-slate-900 w-full">
                    <SelectGroup>
                      <SelectLabel>Sort</SelectLabel>
                      <SelectItem value="apple">name</SelectItem>
                      <SelectItem value="banana">price</SelectItem>
                      <SelectItem value="blueberry">Blueberry</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-45">
                    <SelectValue placeholder="Show" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectGroup>
                      <SelectLabel>Show</SelectLabel>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="30">30</SelectItem>
                      <SelectItem value="40">40</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex lg:flex-row sm:flex-col xs:flex-col gap-4">
                <Grid2X2
                  onClick={() => toggleView('grid')}
                  className={
                    gridOrList === 'grid' ? 'text-ecommerce-primary' : ''
                  }
                />
                <List
                  onClick={() => toggleView('list')}
                  className={
                    gridOrList === 'list' ? 'text-ecommerce-primary' : ''
                  }
                />
              </div>
            </div>
          </div>
          <div className="products-wrapper space-y-2 grid grid-cols-12 gap-4">
            {NEW_PRODUCTS.map((product) => (
              <div
                className={`w-full col-span-full ${
                  gridOrList === 'list'
                    ? 'col-span-full'
                    : 'lg:col-span-3 md:col-span-6 sm:col-span-3 xs:col-span-12'
                }`}
                key={product.id}
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
              </div>
            ))}
          </div>
          <div className="product-pagination-wrapper py-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
      <div className="container px-4 sm:px-6 py-12 max-w-full my-6 md:my-8 lg:my-12 bg-slate-100">
        <OurCustomerCare />
      </div>
    </motion.section>
  );
};

export default ProductCatalog;
