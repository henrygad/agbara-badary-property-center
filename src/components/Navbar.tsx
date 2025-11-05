"use client";

import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import useClickOutSide from "@/hooks/useClickOutSide";
import DisplayImage from "./gallery/DisplayImage";
import { useUserStore } from "@/store/useUserStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { listenToNotifications } from "@/lib/firebase/notification._service";
import NotificationTypes from "@/types/notification.types";
import NotificationPopup from "./NotificationPopup";
import Link from "next/link";

export default function Navbar() {
  const { user, } = useUserStore();

  const {
    notifications,
    addNotification,
  } = useNotificationStore();
  const unreadCount = notifications.filter((n) => !n.viewed).length;

  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);
  const showMenuEleRef = useRef(null);
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const router = useRouter();

  const [popupNotic, setPopupNotic] = useState<NotificationTypes[]>([]);

  useClickOutSide(showMenuEleRef, () => setShowMenu(false));

  useEffect(() => {
    if (pathname.trim()) {
      const path = pathname.split("/");
      const getPath = path[path.length - 1];
      const getPageName = getPath.split("-").join(" ");

      if (getPageName === "admin") {
        setPageTitle("Dashboard");
      } else {
        setPageTitle(getPageName);
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (!user?.id) return;

    listenToNotifications(user?.id, (notic) => {
      addNotification(notic);
      setPopupNotic(notic);
    });
  }, [user, addNotification]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b px-3 sm:px-6 shadow-sm bg-white dark:bg-gray-900 md:bg-white md:shadow-sm dark:border-gray-800">
      {/* Notification popup */}
      <NotificationPopup
        message="You have a new notification."
        show={popupNotic.length !== 0}
        onClose={() => {
          setPopupNotic([]);
        }}
      />

      <div className="flex-1 pl-12 md:pl-0">
        <motion.h2
          key={pageTitle}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-semibold capitalize"
        >
          {pageTitle}
        </motion.h2>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="relative cursor-pointer"
          onClick={() => router.push("/admin/notifications")}
        >
          <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />

          {unreadCount > 0 &&
            <span className="absolute -top-1 -right-1 bg-red-700 text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          }

          {/* <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500"></span> */}
        </button>

        {/* Avatar dropdown */}
        <div className="relative" ref={showMenuEleRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2"
          >
            <motion.div
              whileHover={{ rotate: 5 }}
              className="h-8 w-8 rounded-full bg-gray-100"
            >
              {user?.profileImage?.url &&
                <DisplayImage
                src={user?.profileImage?.url || "avata.png"}
                alt={user?.accountType + " " + "Avatar"}
                useRemove={false}
                type="Profile"
                className="h-8 w-8 rounded-full border-primary border-2"
                />}
            </motion.div>

            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                showMenu && "rotate-180"
              )}
            />
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-40 rounded-md border bg-white py-2 shadow-md dark:bg-gray-800 dark:border-gray-700"
              >
                <Link
                  href="/admin/profile"
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => {                    
                    setShowMenu(false);
                  }}
                >
                  Profile
                </Link>
                <Link
                  href="/admin/settings"
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                  onClick={() => {
                    setShowMenu(false);
                  }}
                >
                 Settings
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
