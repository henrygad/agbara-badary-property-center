"use client";

import { PropertyTypes } from "@/types/property.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";


// Define state shape
interface PropertyState {
    loading: boolean,
    loadingMore: boolean,
    setLoading: (loading: boolean, loadingMore: boolean) => void,
    properties: PropertyTypes[];
    setProperties: (properties: PropertyTypes[]) => void;
    addProperty: (property: PropertyTypes) => void;
    updateProperty: (property: PropertyTypes) => void;
    deleteProperty: (id: string) => void;
    selectedProperty: PropertyTypes | null;
    setSelectedProperty: (property: PropertyTypes | null) => void;
}

// Create the store
export const usePropertyStore = create(
    persist<PropertyState>(
        (set) => ({
            properties: [],
            selectedProperty: null,
            loading: false,
            loadingMore: false,

            setLoading: (loading, loadingMore) => set({ loading, loadingMore }),

            setProperties: (properties) => set({ properties }),

            addProperty: (property) =>
                set((state) => ({ properties: [...state.properties, property] })),

            updateProperty: (property) =>
                set((state) => ({
                    properties: state.properties.map((p) =>
                        p.id === property.id ? property : p
                    ),
                })),

            deleteProperty: (id) =>
                set((state) => ({
                    properties: state.properties.filter((p) => p.id !== id),
                })),

            setSelectedProperty: (property) => set({ selectedProperty: property }),
        }),
        {
            name: "property-storage", // key for localStorage
        }
    )
);

