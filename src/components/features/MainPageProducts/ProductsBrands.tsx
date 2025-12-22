import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import pclogo1 from '@/public/images/pc-company/pc-logo1.png';
import pclogo2 from '@/public/images/pc-company/pc-logo2.png';
import pclogo3 from '@/public/images/pc-company/pc-logo3.png';
import pclogo4 from '@/public/images/pc-company/pc-logo4.png';
import pclogo5 from '@/public/images/pc-company/pc-logo5.png';

type Props = {};

const ProductsBrands = (props: Props) => {
  const productCompanyLogo = [
    { src: pclogo1, alt: 'Brand 1' },
    { src: pclogo2, alt: 'Brand 2' },
    { src: pclogo3, alt: 'Brand 3' },
    { src: pclogo4, alt: 'Brand 4' },
    { src: pclogo5, alt: 'Brand 5' },
  ];

  return (
    <div className="mx-4 my-2 flex flex-row justify-center items-center gap-2">
      {productCompanyLogo.map((ele) => (
        <Image src={ele.src} alt={ele.alt} width={100} height={50} loading='lazy' className='mx-3' />
      ))}
    </div>
  );
};

export default ProductsBrands;
