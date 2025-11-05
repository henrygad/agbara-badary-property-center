import UserTypes from "@/types/user.types";
import { create } from "zustand";


interface UserState {
    loading: boolean;
    isAuthenticated: boolean;   
    user: UserTypes | null;
    setLoading: (loading: boolean) => void;
    setUser: (user: UserTypes | null) => void;
    updateUser: (user: Partial<UserTypes>) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    isAuthenticated: false,    
    loading: false,
    setLoading: (loading) => set({ loading }),
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    updateUser: (user) => set((state) => ({ user: { ...state.user, ...user } as UserTypes })),
    logout: () => set({ user: null, isAuthenticated: false }),
}));
