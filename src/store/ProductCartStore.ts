import { createStore } from 'zustand';

export interface IProductCartItems {
  products: any[];
  paymentMethod: string;
}

export const useProductCartStore = createStore < {};
