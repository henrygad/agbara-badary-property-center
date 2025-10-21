import UserTypes from "@/types/user.types";
import { create } from "zustand";

// const admin: UserTypes = {
//     profileImage: { url: "/images/admin-avatar.jpg", publicId: "admin-avatar" },
//     firstName: "Ebuka",
//     lastName: "Lawrence",
//     bio: "Dedicated property manager passionate about helping clients find their dream homes.",
//     gender: "Male",
//     email: "ebuka@example.com",
//     authEmail: "ebuka@example.com",
//     phone: "+234 801 234 5678",
//     company: "RealPro Agency",
//     role: "Admin",
//     accountType: "Admin",
//     createdAt: new Date("March 10, 2024"),
//     lastLogin: new Date("October 18, 2025"),
// };

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
