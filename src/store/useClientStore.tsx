"use client";

import { PropertyTypes } from "@/types/property.types";
import { create } from "zustand";


// Create the store
interface PropertyStoreActions {
    setLoading: (loading: boolean, loadingMore: boolean) => void;
    setProperties: (properties: PropertyTypes[]) => void;
}

interface PropertyStoreState {
    properties: PropertyTypes[];
    loading: boolean;
    loadingMore: boolean;
}

type PropertyStore = PropertyStoreState & PropertyStoreActions;

export const useClientStore = create<PropertyStore>(
    (set) => ({
        properties: [],
        loading: true,
        loadingMore: false,
        setLoading: (loading: boolean, loadingMore: boolean) => set({ loading, loadingMore }),
        setProperties: (properties: PropertyTypes[]) => set({ properties: properties.filter(p => p.availability === "Accepted") }),
    })
);

