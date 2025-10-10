"use client";

import ImageTypes from "@/types/image.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define state shape
interface ImageState {
    loading: boolean,
    loadingMore: boolean,
    setLoading: (loading: boolean, loadingMore: boolean) => void,
    images: ImageTypes[];
    setImages: (images: ImageTypes[]) => void;
    addImage: (property: ImageTypes) => void;
    //updateImage: (property: ImageTypes) => void;
    deleteImage: (id: string) => void;
    selectedImage: ImageTypes | null;
    setSelectedImage: (property: ImageTypes | null) => void;
}

// Create the store
export const useImageStore = create(
    persist<ImageState>(
        (set) => ({
            images: [],
            selectedImage: null,
            loading: false,
            loadingMore: false,

            setLoading: (loading, loadingMore) => set({ loading, loadingMore }),

            setImages: (images) => set({ images }),

            addImage: (property) =>
                set((state) => ({ images: [...state.images, property] })),

            deleteImage: (publicId) =>
                set((state) => ({
                    images: state.images.filter((p) => p.publicId !== publicId),
                })),

            setSelectedImage: (property) => set({ selectedImage: property }),
        }),
        {
            name: "image-storage", // key for localStorage
        }
    )
);
