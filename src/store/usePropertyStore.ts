"use client";

import { DEFAULT_PROPERTY_FORM } from "@/components/add_property/defaultData";
import { PropertyTypes } from "@/types/property.types";
import { create } from "zustand";


// Create the store
interface PropertyStoreActions {
    setLoading: (loading: boolean, loadingMore: boolean) => void;
    setProperties: (properties: PropertyTypes[]) => void;
    addProperty: (property: PropertyTypes) => void;
    updateProperty: (property: PropertyTypes) => void;
    deleteProperty: (id: string) => void;
    setForm: (cb: (p: PropertyTypes) => PropertyTypes) => void;
    setSelectedProperty: (property: PropertyTypes | null) => void;
}

interface PropertyStoreState {
    form: PropertyTypes;
    properties: PropertyTypes[];
    selectedProperty: PropertyTypes | null;
    loading: boolean;
    loadingMore: boolean;
}

type PropertyStore = PropertyStoreState & PropertyStoreActions;

export const usePropertyStore = create<PropertyStore>(
    (set) => ({
        form: DEFAULT_PROPERTY_FORM,
        properties: [],
        selectedProperty: null,
        loading: false,
        loadingMore: false,

        setLoading: (loading: boolean, loadingMore: boolean) => set({ loading, loadingMore }),

        setProperties: (properties: PropertyTypes[]) => set({ properties }),

        addProperty: (property: PropertyTypes) =>
            set((state) => ({ properties: [...state.properties, property] })),

        updateProperty: (property: PropertyTypes) =>
            set((state) => ({
                properties: state.properties.map((p) =>
                    p.id === property.id ? property : p
                ),
            })),

        deleteProperty: (id: string) =>
            set((state) => ({
                properties: state.properties.filter((p) => p.id !== id),
            })),
        setForm: (cb: (p: PropertyTypes) => PropertyTypes) => {
            set((state) => {
                return { form: cb(state.form) };
            });
        },
        setSelectedProperty: (property: PropertyTypes | null) => set({ selectedProperty: property }),
    })
);

