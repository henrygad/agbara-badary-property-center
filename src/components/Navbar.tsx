"use client";

import { usePathname, useRouter } from "next/navigation";
import { Bell, Sun, Moon, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import useClickOutSide from "@/hooks/useClickOutSide";
import DisplayImage from "./gallery/DisplayImage";
import { useUserStore } from "@/store/useUserStore";

export default function Navbar() {
  const { user } = useUserStore();

  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const showMenuEleRef = useRef(null);
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const router = useRouter()

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
    const theme = JSON.parse(localStorage.getItem("theme") || "{}");
    if (theme.dark) {
      setDark(theme.dark)
    }

    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);


  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b px-3 sm:px-6 shadow-sm bg-white dark:bg-gray-900 md:bg-white md:shadow-sm dark:border-gray-800">
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
          <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* Dark mode toggle */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={() => setDark((prev) => {
            localStorage.setItem("theme", JSON.stringify({ dark: !prev }));
            return !prev
          })}
          className="cursor-pointer"
        >
          {dark ? (
            <Sun className="h-5 w-5 text-yellow-400" />
          ) : (
            <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          )}
        </motion.button>

        {/* Avatar dropdown */}
        <div
          className="relative"
          ref={showMenuEleRef}
        >
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2"
          >
            <motion.div
              whileHover={{ rotate: 5 }}
              className="h-8 w-8 rounded-full"
            >
              {user?.profileImage?.url &&
                <DisplayImage
                  src={user?.profileImage.url}
                  alt={user?.accountType + " " + "Avatar"}
                  useRemove={false}
                  type="Profile"
                  className="h-8 w-8 rounded-full"
                />
              }
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
                <button
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => {
                    router.push("/admin/profile");
                    setShowMenu(false)
                  }}
                >
                  Profile
                </button>
                <button
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                  onClick={() => {                
                    setShowMenu(false);
                  }}
                >
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
