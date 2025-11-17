"use client";

import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { getImagesDb } from "@/lib/firebase/image_service";
import { getPropertyByAgentId } from "@/lib/firebase/property_service";
import { useImageStore } from "@/store/useImageStore";
import { usePropertyStore } from "@/store/usePropertyStore";
import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { usePathname } from "next/navigation";
import { DEFAULT_PROPERTY_FORM } from "@/components/add_property_form/defaultData";
import { useNotificationStore } from "@/store/useNotificationStore";
import { getNotificationByUserIdDb } from "@/lib/firebase/notification._service";
import UserTypes from "@/types/user.types";
import { useClientStore } from "@/store/useClientStore";
import { PropertyTypes } from "@/types/property.types";
import { useDraftStore } from "@/store/useDraftStore";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const { dark, setDark } = useClientStore();
  
  const { setUser, setLoading: setUserLoading } = useUserStore();

  const {
    setLoading: setPropertyLoading,
    setProperties,
    setForm,
  } = usePropertyStore();

  const { setLoading: setImageLoading, setImages } = useImageStore();

  const {setDraft } = useDraftStore();

  const { setLoading: setNotificationLoading, setNotification } = useNotificationStore();


  // Fetch Admin datas
  useEffect(() => {

    // Fetch client draft locally
    const drafts = JSON.parse(
      localStorage.getItem("drafts") || "[]"
    ) as PropertyTypes[]

    setDraft(drafts);   

    const fetchAdmin = async () => {
      setUserLoading(true);
      setPropertyLoading(true, false);
      setImageLoading(true, false);
      setNotificationLoading(true, false);   

      try {
        const res = await fetch("/api/agent/account");
        const { agent, success } = await res.json() as { message: string, success: string, agent: UserTypes };

        if (!success || !agent || !agent.id) return;

        setUser(agent);
        setUserLoading(false);

        // Fetch All properties        
        const properties = await getPropertyByAgentId(agent.id);        
        if (properties) {
          setProperties(properties);
        }
        setPropertyLoading(false, false);

        // Fetch agent images       
        const images = await getImagesDb(agent.id);
        if (images) {
          setImages(images);
        }
        setImageLoading(false, false);

        // Fetch notifications
        const notics = await getNotificationByUserIdDb(agent.id);
        if (notics) {
          setNotification(notics);
        }
        setNotificationLoading(false, false);
            
      } catch (error) {
        console.error("Error fetching agent:", error);
      } finally {
        setUserLoading(false);
        setPropertyLoading(false, false);
        setImageLoading(false, false);
        setNotificationLoading(false, false);   
      }
    };

    fetchAdmin();
  }, [
    setImageLoading,
    setImages,
    setPropertyLoading,
    setProperties,
    setUser,
    setUserLoading,
    setNotification,
    setNotificationLoading,
    setDraft,
  ]);


  // Display page title
  useEffect(() => {
    // If we not in add-property or edit-property or review-property page
    // Clean setForm in property store
    if (
      !pathname.includes("add-property") &&
      !pathname.includes("edit-property") &&
      !pathname.includes("review-property")
    ) {
      setForm(() => DEFAULT_PROPERTY_FORM);
    }
  }, [pathname, setForm]);

  // Dark mode
  useEffect(() => {
    const theme = JSON.parse(localStorage.getItem("theme") || "{}");
    if (theme.dark) {
      setDark(theme.dark);
    }

    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark, setDark]);


  return (
    <div className="text-wrap flex flex-col text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="md:ml-64 flex-1">
        <Navbar />
        <main className="p-3 md:px-6 py-6 dark:bg-gray-800 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
