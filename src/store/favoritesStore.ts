import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface FavoritesState {
  favorites: (string | number)[]; // Array of product IDs

  // Actions
  addFavorite: (productId: string | number) => void;
  removeFavorite: (productId: string | number) => void;
  toggleFavorite: (productId: string | number) => void;
  clearFavorites: () => void;

  // Getters
  isFavorite: (productId: string | number) => boolean;
  getFavoritesCount: () => number;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (productId) => {
        const { favorites } = get();
        if (!favorites.includes(productId)) {
          set({ favorites: [...favorites, productId] });
        }
      },

      removeFavorite: (productId) => {
        set({
          favorites: get().favorites.filter((id) => id !== productId),
        });
      },

      toggleFavorite: (productId) => {
        const { favorites, addFavorite, removeFavorite } = get();
        if (favorites.includes(productId)) {
          removeFavorite(productId);
        } else {
          addFavorite(productId);
        }
      },

      clearFavorites: () => set({ favorites: [] }),

      isFavorite: (productId) => {
        return get().favorites.includes(productId);
      },

      getFavoritesCount: () => {
        return get().favorites.length;
      },
    }),
    {
      name: 'ecommerce-favorites',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
