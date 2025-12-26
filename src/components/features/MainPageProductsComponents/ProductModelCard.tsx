'use client';
import Link from 'next/link';

type Props = {
  modelTitle: string;
  modelUrlSlug: string;
};

const ProductModelCard = ({ modelTitle, modelUrlSlug }: Props) => {
  return (
    <div className="w-full relative bg-[url(/img/mountains.jpg)]">
      <div className="w-full h-75 rounded-xs flex flex-col justify-around items-center">
        <h4 className="text-white font-semibold">{modelTitle}</h4>
        <Link href={`/product-catalog/${modelUrlSlug}`} />
      </div>
    </div>
  );
};

export default ProductModelCard;
