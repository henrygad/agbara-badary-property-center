// src/store/useUIStore.ts
import { create } from "zustand";

export const useUIStore = create((set) => ({
    isFilterOpen: false,
    toggleFilter: () => set((state: {isFilterOpen: boolean}) => ({ isFilterOpen: !state.isFilterOpen })),
}));
