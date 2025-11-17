"use client";

import RequestTypes from "@/types/request.types";
import { create } from "zustand";


// Create the store
interface RequestStoreActions {
    setLoading: (loading: boolean, loadingMore: boolean) => void;
    setRequests: (requests: RequestTypes[]) => void;
    addRequest: (request: RequestTypes) => void;
    updateRequest: (request: RequestTypes) => void;   
}

interface RequestStoreState {   
    requests: RequestTypes[];   
    loading: boolean;
    loadingMore: boolean;
}

type RequestStore = RequestStoreState & RequestStoreActions;

export const useRequestStore = create<RequestStore>(
    (set) => ({       
        requests: [],       
        loading: false,
        loadingMore: false,

        setLoading: (loading: boolean, loadingMore: boolean) => set({ loading, loadingMore }),

        setRequests: (requests: RequestTypes[]) => set({ requests: requests.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) }),

        addRequest: (request: RequestTypes) =>
            set((state) => ({ requests: [...state.requests, request] })),

        updateRequest: (request: RequestTypes) =>
            set((state) => ({
                requests: state.requests.map((p) =>
                    p.id === request.id ? request : p
                ),
        })),       
    })
);

