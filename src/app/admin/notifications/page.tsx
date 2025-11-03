"use client";

import PageLoader from "@/components/loaders/PageLoader";
import NotificationCard from "@/components/NotificationCard";
import ReturnBack from "@/components/ReturnBack";
import { useNotificationStore } from "@/store/useNotificationStore";

export default function NotificationsPage() {
  const { notifications, loading } = useNotificationStore();


  if (loading) {
    return <PageLoader loading={loading} />;
  }

  return (
    <div className="w-full">
      <menu className="mt-2 mb-5">
        <ReturnBack />
      </menu>

      {notifications.length === 0 ? (
        <div className="h-full w-full flex justify-center items-center">
          <p className="text-gray-600 text-center text-sm py-10">No notifications yet</p>
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
