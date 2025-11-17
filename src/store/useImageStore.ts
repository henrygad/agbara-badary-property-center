"use client";

import ImageTypes from "@/types/image.types";
import { create } from "zustand";

// Define state shape
interface ImageState {
    loading: boolean,
    loadingMore: boolean,
    setLoading: (loading: boolean, loadingMore: boolean) => void,
    images: ImageTypes[];
    setImages: (images: ImageTypes[]) => void;
    addImage: (property: ImageTypes) => void;    
    deleteImage: (id: string) => void;
    selectedImage: ImageTypes | null;
    setSelectedImage: (property: ImageTypes | null) => void;
}

// Create the store
export const useImageStore = create<ImageState>(
    (set) => ({
        images: [],
        selectedImage: null,
        loading: false,
        loadingMore: false,

        setLoading: (loading, loadingMore) => set({ loading, loadingMore }),

        setImages: (images) => set({ images }),

        addImage: (image) =>
            set((state) => ({ images: [image, ...state.images] })),

        deleteImage: (id) =>
            set((state) => ({
                images: state.images.filter((p) => p.id !== id),
            })),

        setSelectedImage: (image) => set({ selectedImage: image }),
    })
);
