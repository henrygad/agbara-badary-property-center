"use client";

import NotificationTypes from "@/types/notification.types";
import { create } from "zustand";

// Create the store
interface NotificationStoreActions {
    setLoading: (loading: boolean, loadingMore: boolean) => void;
    setNotification: (notifications: NotificationTypes[]) => void;
    addNotification: (notifications: NotificationTypes[]) => void;
    viewedNotification: (id: string) => void;
}

interface NotificationStoreState {
    notifications: NotificationTypes[];
    loading: boolean;
    loadingMore: boolean;
}

type NotificationStore = NotificationStoreState & NotificationStoreActions;

export const useNotificationStore = create<NotificationStore>(
    (set) => ({
        notifications: [],
        loading: false,
        loadingMore: false,

        setLoading: (loading: boolean, loadingMore: boolean) => set({ loading, loadingMore }),

        setNotification: (notifications: NotificationTypes[]) => set({ notifications: notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) }),

        addNotification: (notifications: NotificationTypes[]) =>
            set((state) => ({ notifications: [...notifications, ...state.notifications] })),

        viewedNotification: (id: string) =>
            set((state) => ({ notifications: [...state.notifications.map(nf => nf.id === id ? { ...nf, viewed: true } : nf)] })),
    })
);

