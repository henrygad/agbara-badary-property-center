"use client";

import UserTypes from "@/types/user.types";
import { create } from "zustand";

// Create the store
interface AgentStoreActions {
    setLoading: (loading: boolean, loadingMore: boolean) => void;
    setAgents: (agents: UserTypes[]) => void;
    updateAgent: (agent: UserTypes) => void;
    deleteAgent: (id: string) => void;
}

interface AgentStoreState {
    agents: UserTypes[];
    loading: boolean;
    loadingMore: boolean;
}

type AgentStore = AgentStoreState & AgentStoreActions;

export const useAgentStore = create<AgentStore>(
    (set) => ({
        agents: [],
        loading: false,
        loadingMore: false,

        setLoading: (loading: boolean, loadingMore: boolean) => set({ loading, loadingMore }),

        setAgents: (agents: UserTypes[]) => set({ agents: agents.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) }),

        updateAgent: (agent: UserTypes) =>
            set((state) => ({
                agents: state.agents.map((p) =>
                    p.id === agent.id ? agent : p
                ),
            })),

        deleteAgent: (id: string) =>
            set((state) => ({
                agents: state.agents.filter((p) => p.id !== id),
            })),
    })
);


