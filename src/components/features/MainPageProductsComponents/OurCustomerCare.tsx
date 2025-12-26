import { Card, CardContent } from '@/components/ui/card';
import { CardSimIcon, HeadphonesIcon, LocationEdit } from 'lucide-react';
import React from 'react';

type Props = {};

const OurCustomerCare = (props: Props) => {
  return (
    <section className="relative container sm:px-40 lg:px-20 px-4 py-12 mx-auto">
      <div className="grid grid-cols-3 gap-4 place-items-center">
        <Card className="lg:col-span-1 sm:col-span-full shadow-0">
          <CardContent className="flex flex-col justify-center items-center">
            <HeadphonesIcon className="text-ecommerce-primary" />
            <h1 className="text-2xl sm:text-base my-4 font-black">
              Product Support
            </h1>
            <p className="text-sm mt-2 mb-4 font-normal text-black text-center">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure
              facere, sed hic aspernatur explicabo velit quisquam dicta unde
              quaerat debitis vel iusto voluptatem maxime consectetur commodi
              error voluptatibus tempore distinctio.
            </p>
          </CardContent>
        </Card>
        <Card className="lg:col-span-1 sm:col-span-full">
          <CardContent className="flex flex-col justify-center items-center">
            <LocationEdit className="text-ecommerce-primary" />
            <h1 className="text-2xl sm:text-base my-4 font-black">
              Product Support
            </h1>
            <p className="text-sm mt-2 mb-4 font-normal text-black text-center">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure
              facere, sed hic aspernatur explicabo velit quisquam dicta unde
              quaerat debitis vel iusto voluptatem maxime consectetur commodi
              error voluptatibus tempore distinctio.
            </p>
          </CardContent>
        </Card>
        <Card className="lg:col-span-1 sm:col-span-full">
          <CardContent className="flex flex-col justify-center items-center">
            <CardSimIcon className="text-ecommerce-primary" />
            <h1 className="text-2xl sm:text-base my-4 font-black">
              Product Support
            </h1>
            <p className="text-sm mt-2 mb-4 font-normal text-black text-center">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure
              facere, sed hic aspernatur explicabo velit quisquam dicta unde
              quaerat debitis vel iusto voluptatem maxime consectetur commodi
              error voluptatibus tempore distinctio.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default OurCustomerCare;
