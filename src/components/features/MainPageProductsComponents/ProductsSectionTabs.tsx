'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { NEW_PRODUCTS } from '@/core/mock/ProductsData';
import ProductCard from './ProductCard';
import { useRouter } from 'next/navigation';

type Props = {
  activeTab: string;
  // childModelComponent: React.ReactNode;
};

const ProductsSectionTabs = ({
  activeTab,
  children,
}: {
  activeTab: string;
  children: React.ReactNode;
}) => {
  const router = useRouter();
  return (
    <>
      <Tabs
        defaultValue={activeTab ?? 'msi_gs'}
        className="col-span-full w-full"
      >
        <ScrollArea className="w-full">
          <TabsList className="inline-flex w-full md:w-auto">
            <TabsTrigger value="msi_gs">MSI GS Series</TabsTrigger>
            <TabsTrigger value="msi_gle">MSI GLE Series</TabsTrigger>
            <TabsTrigger value="msi_gt">MSI GT Series</TabsTrigger>
            <TabsTrigger value="msi_ge">MSI GE Series</TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" className="md:hidden" />
        </ScrollArea>
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            {children}
          </div>
          <div className="col-span-12 md:col-span-8 lg:col-span-9">
            <TabsContent
              value="msi_gs"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-2 md:p-4"
            >
              {NEW_PRODUCTS.slice(0, 4).map((product) => (
                <div className="w-full" key={product.id}>
                  <ProductCard
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    discountPrice={product.discountPrice}
                    inStock={product.inStock}
                    onDetails={() => {
                      // Handle product details navigation
                      router.push(product.url);
                      console.log('Product details:', product.id);
                    }}
                  />
                </div>
              ))}
            </TabsContent>
            <TabsContent
              value="msi_gle"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-2 md:p-4"
            >
              {NEW_PRODUCTS.slice(1, 5).map((product) => (
                <div className="w-full" key={product.id}>
                  <ProductCard
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    discountPrice={product.discountPrice}
                    inStock={product.inStock}
                    onDetails={() => {
                      // Handle product details navigation
                      router.push(product.url);
                      console.log('Product details:', product.id);
                    }}
                  />
                </div>
              ))}
            </TabsContent>
            <TabsContent
              value="msi_gt"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-2 md:p-4"
            >
              {NEW_PRODUCTS.slice(0, 4).map((product) => (
                <div className="w-full" key={product.id}>
                  <ProductCard
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    discountPrice={product.discountPrice}
                    inStock={product.inStock}
                    onDetails={() => {
                      // Handle product details navigation
                      router.push(product.url);
                      console.log('Product details:', product.id);
                    }}
                  />
                </div>
              ))}
            </TabsContent>
            <TabsContent
              value="msi_ge"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-2 md:p-4"
            >
              {NEW_PRODUCTS.slice(2, 6).map((product) => (
                <div className="w-full" key={product.id}>
                  <ProductCard
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    discountPrice={product.discountPrice}
                    inStock={product.inStock}
                    onDetails={() => {
                      // Handle product details navigation
                      router.push(product.url);
                      console.log('Product details:', product.id);
                    }}
                  />
                </div>
              ))}
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </>
  );
};

export default ProductsSectionTabs;
