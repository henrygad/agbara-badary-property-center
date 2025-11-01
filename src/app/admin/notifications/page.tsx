"use client";

import PageLoading from "@/components/loaders/PageLoader";
import NotificationCard from "@/components/Notification";
import { useNotificationStore } from "@/store/useNotificationStore";

export default function NotificationsPage() {
  const { notifications, loading } = useNotificationStore();

  if (loading) {
    return <PageLoading loading={loading} />;
  }


  return (
    <div className="w-full">
      {notifications.length === 0 ? (
        <div className="h-full w-full flex justify-center items-center">
          <p className="text-gray-500 text-center py-10">No notifications yet</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {notifications.map((n) => (
            <NotificationCard key={n.id} n={n} />
          ))}
        </ul>
      )}
    </div>
  );
}
