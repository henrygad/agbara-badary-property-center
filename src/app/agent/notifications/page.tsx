"use client";

import ItemNotFound from "@/components/ItemNotFound";
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
        <ItemNotFound>No notification</ItemNotFound>
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
