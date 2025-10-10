import { create } from "zustand";

export interface User {
    id: string;
    name: string;
    email: string;
    role: "admin" | "agent" | "user";
    token?: string;
}

interface UserState {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    logout: () => void;
}

// Persist to localStorage (optional)
export const useUserStore = create<UserState>((set) => ({
    user: null,
    isAuthenticated: false,

    setUser: (user) => set({ user, isAuthenticated: !!user }),
    logout: () => set({ user: null, isAuthenticated: false }),
}));
