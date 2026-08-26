import { create } from 'zustand'

export const useAuthStore = create((set, get, store) => ({
  
  isLoggedIn: false,

  login: () => set({ isLoggedIn: true }),
  logout: () => set({ isLoggedIn: false})
}))