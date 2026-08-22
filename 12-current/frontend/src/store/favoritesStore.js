import { create } from 'zustand'

export const useFavoritesStore = create((set, get, store) => ({
  favorites: [],

  isFavorite: (jobId) => get().favorites.includes(jobId),

  getFavoritesCount: () => get().favorites.length,
  
  addFavorite: (jobId) => {
    set((state) => ({
      favorites: get().isFavorite(jobId)
        ? state.favorites
        : [...state.favorites, jobId],
    }));
  },

  removeFavorite: (jobId) => {
    set((state) => ({
      favorites: state.favorites.filter((id) => id !== jobId),
    }));
  },

  toggleFavorite: (jobId) => {
    const { addFavorite, removeFavorite, isFavorite } = get();
    isFavorite(jobId) ? removeFavorite(jobId) : addFavorite(jobId);
  },

  reset: () => set(store.getInitialState()),
}));