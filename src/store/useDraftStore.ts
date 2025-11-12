"use client";

import { PropertyTypes } from "@/types/property.types";
import { create } from "zustand";


// Create the store
interface DraftStoreActions {
    setLoading: (loading: boolean, loadingMore: boolean) => void;
    setDraft: (properties: PropertyTypes[]) => void;
    addDraft: (property: PropertyTypes) => void;   
    deleteDraft: (draftId: string) => void;    
}

interface draftStoreState {    
    drafts: PropertyTypes[];    
    loading: boolean;
    loadingMore: boolean;    
}

type DraftStore = draftStoreState & DraftStoreActions;

export const useDraftStore = create<DraftStore>(
    (set) => ({        
        drafts: [],
        loading: false,
        loadingMore: false,

        setLoading: (loading: boolean, loadingMore: boolean) => set({ loading, loadingMore }),

        setDraft: (properties: PropertyTypes[]) => set({ drafts: properties }),

        addDraft: (property: PropertyTypes) =>
            set((state) => ({ drafts: [property, ...state.drafts] })),
       

        deleteDraft: (draftId: string) =>
            set((state) => ({
                drafts: state.drafts.filter((p) => p.draftId !== draftId),
            })),        
    })
);

