"use client";

import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { getImagesDb } from "@/lib/firebase/image_service";
import { getPropertiesDb } from "@/lib/firebase/property_service";
import { useImageStore } from "@/store/useImageStore";
import { usePropertyStore } from "@/store/usePropertyStore";
import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { usePathname } from "next/navigation";
import { DEFAULT_PROPERTY_FORM } from "@/components/add_property_form/defaultData";
import { getAgentsDb } from "@/lib/firebase/agent_service";
import { useNotificationStore } from "@/store/useNotificationStore";
import { getNotificationByUserIdDb } from "@/lib/firebase/notification._service";
import { useRequestStore } from "@/store/useRequestStore";
import { getRequestsDb } from "@/lib/firebase/request_service";
import { useAgentStore } from "@/store/useAgentStore";
import UserTypes from "@/types/user.types";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const { setUser, setLoading: setAdminLoading } = useUserStore();

  const {
    setLoading: setPropertyLoading,
    setProperties,
    setForm,
  } = usePropertyStore();

  const { setLoading: setImageLoading, setImages } = useImageStore();

  const { setLoading: setNotificationLoading, setNotification } = useNotificationStore();

  const { setLoading: setRequestsLoading, setRequests } = useRequestStore();

  const { setLoading: setAgentsLoading, setAgents } = useAgentStore();

  // Fetch Admin datas
  useEffect(() => {

    const fetchAdmin = async () => {
      setAdminLoading(true);
      setPropertyLoading(true, false);
      setImageLoading(true, false);
      setNotificationLoading(true, false);
      setRequestsLoading(true, false);
      setAgentsLoading(true, false);

      try {
        const res = await fetch("/api/agent/account");
        const { agent, success } = await res.json() as { message: string, success: string, agent: UserTypes };

        if (!success || !agent || !agent.id) return;

        setUser(agent);
        setAdminLoading(false);

          // Fetch All properties        
          const properties = await getPropertiesDb();
          if (properties) {
            setProperties(properties);
          }
          setPropertyLoading(false, false);

          // Fetch admin properties         
        const images = await getImagesDb(agent.id!);
          if (images) {
            setImages(images);
          }
          setImageLoading(false, false);


          // Fetch notifications
          const notics = await getNotificationByUserIdDb("admin");
          if (notics) {
            setNotification(notics);
          }
          setNotificationLoading(false, false);

          // Fetch requests
          const request = await getRequestsDb();
          if (request) {
            setRequests(request);
          }
          setRequestsLoading(false, false);

          // Fetch agents
          const agents = await getAgentsDb();
          if (agents) {
            setAgents(agents);
          }
          setAgentsLoading(false, false);

      } catch (error) {
        console.error("Error fetching admin:", error);
      }
    };

    fetchAdmin();
  }, [
    setImageLoading,
    setImages,
    setPropertyLoading,
    setProperties,
    setUser,
    setAdminLoading,
    setNotification,
    setNotificationLoading,
    setAgents,
    setAgentsLoading,
    setRequests,
    setRequestsLoading
  ]);


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



  return (
    <div className="break-words text-wrap flex flex-col text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-900">
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
