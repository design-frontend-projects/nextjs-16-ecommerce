import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NEW_PRODUCTS } from '@/core/mock/ProductsData';
import ProductCard from './ProductCard';

type Props = {
  activeTab: string;
};

const ProductsSectionTabs = ({ activeTab }: Props) => {
  return (
    <>
      <Tabs defaultValue={activeTab ?? 'msi_gs'} className="col-span-full">
        <TabsList>
          <TabsTrigger value="msi_gs">MSI GS Series</TabsTrigger>
          <TabsTrigger value="msi_gle">MSI GLE Series</TabsTrigger>
          <TabsTrigger value="msi_gt">MSI GT Series</TabsTrigger>
          <TabsTrigger value="msi_ge">MSI GE Series</TabsTrigger>
        </TabsList>
        <div className="grid grid-cols-12">
          <div className="lg:col-span-3 sm:col-span-1">some data here</div>
          <div className="lg:col-span-9 sm:col-span-1">
            <TabsContent value="msi_gs" className="grid grid-cols-12 gap-3 p-2">
              {NEW_PRODUCTS.slice(0, 4).map((product) => (
                <div className="lg:col-span-3 sm:col-span-1" key={product.id}>
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
            </TabsContent>
            <TabsContent
              value="msi_gle"
              className="grid grid-cols-12 gap-3 p-2"
            >
              {NEW_PRODUCTS.slice(1, 5).map((product) => (
                <div className="lg:col-span-3 sm:col-span-2" key={product.id}>
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
            </TabsContent>
            <TabsContent value="msi_gt" className="grid grid-cols-12 gap-3 p-2">
              {NEW_PRODUCTS.slice(0, 4).map((product) => (
                <div className="lg:col-span-3 sm:col-span-2" key={product.id}>
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
            </TabsContent>
            <TabsContent value="msi_ge" className="grid grid-cols-12 gap-3 p-2">
              {NEW_PRODUCTS.slice(2, 6).map((product) => (
                <div className="lg:col-span-3 sm:col-span-2" key={product.id}>
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
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </>
  );
};

export default ProductsSectionTabs;
