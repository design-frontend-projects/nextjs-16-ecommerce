import prismaInstance from '@/config/prismaConnection';
import { useQuery } from '@tanstack/react-query';

export const getProductsApi = async () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await prismaInstance.products.findMany();
      return res;
    },
  });
};
