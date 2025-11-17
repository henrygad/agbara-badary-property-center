"use client";

import { DEFAULT_PROPERTY_FORM } from "@/components/add_property_form/defaultData";
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
    isFormDirty: boolean
}

type PropertyStore = PropertyStoreState & PropertyStoreActions;

export const usePropertyStore = create<PropertyStore>(
    (set) => ({
        form: DEFAULT_PROPERTY_FORM,
        properties: [],
        selectedProperty: null,
        loading: false,
        loadingMore: false,
        isFormDirty: false,

        setLoading: (loading: boolean, loadingMore: boolean) => set({ loading, loadingMore }),

        setProperties: (properties: PropertyTypes[]) => set({
            properties: properties.sort((a, b) => {
                const timeA = (a?.createdAt || new Date()).getTime();
                const timeB = (b?.createdAt || new Date()).getTime();

                return timeB - timeA;
            }) }),

        addProperty: (property: PropertyTypes) =>
            set((state) => ({ properties: [property, ...state.properties] })),

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
                const form = cb(state.form);
                const isFormDirty =
                    Object.values({
                        ...form,
                        images: form.images.length ? form.images[0] : "",
                        amenities: form.amenities.length ? form.amenities[0] : "",
                        agentName: "",
                        agentEmail: "",
                        agentPhoto: "",
                        agentPhone: "",
                        agentCompany: "",
                        accountType: "",
                        agentId: "",
                        availability: "",
                        packageType: "",
                        showContact: "",
                        createdAt: "",
                        updatedAt: "",
                        priceFrequency: "",
                        serviceChargeFrequency: "",
                        currency: "",
                        sizeUnit: "",
                        negotiable: "",
                    }).some((val) => (val !== "" && val !== undefined && val !== 0 && val !== null));

                return { form, isFormDirty };
            });
        },
        
        setSelectedProperty: (property: PropertyTypes | null) => set({ selectedProperty: property }),
    })
);

