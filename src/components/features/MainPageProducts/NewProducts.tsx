'use client';
import React from 'react';

type Props = {};

const NewProducts = (props: Props) => {
  return (
    <div className="relative w-full py-4">
      <div className="flex flex-row justify-between items-center w-full">
        <h4 className="text-xl font-bold text-black">New Products</h4>
        <h4 className="text-sm font-bold text-ecommerce-primary underline">See all new products</h4>
      </div>
    </div>
  );
};

export default NewProducts;
