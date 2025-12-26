'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface IAppProps {}

export default async function ProductDetailsPage({ params }: any) {
  const slug = await params;
  const [productName] = slug.slug;

  return (
    <div className="relative w-full px-4 py-6">
      <div className="grid grid-cols-12 gap-4">
        <div className="lg:col-span-6 sm:col-span-full">
          <Tabs defaultValue="account">
            <TabsList>
              <TabsTrigger value="aboutproduct">About Product</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="specs">Specs</TabsTrigger>
            </TabsList>
            <TabsContent value="aboutproduct">
              <Card className="shadow">
                <CardHeader>
                  <CardTitle>{productName}</CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>
            <TabsContent value="details">
              <Card className="shadow">
                <CardHeader>
                  <CardTitle>MSI GP1</CardTitle>
                  <CardDescription className="text-ecommerce-primary">
                    be the first one to review it
                  </CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>
            <TabsContent value="specs">
              <Card className="shadow">
                <CardHeader>
                  <CardTitle>Account</CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div className="lg:col-span-6 sm:col-span-full flex flex-row justify-between py-1">
          <h1 className="text-sm font-medium">
            On sale from: <span className="mx-1 font-bold">$ 3,444</span>
          </h1>
          <Button className="bg-ecommerce-primary text-white font-bold">
            Add to card
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6"></div>
        <div className="col-span-6"></div>
      </div>
    </div>
  );
}
