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
import { getAdminDb } from "@/lib/firebase/admin_service";
import { usePathname } from "next/navigation";
import { DEFAULT_PROPERTY_FORM } from "@/components/add_property/defaultData";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const { setUser, setLoading: setAdminLoading } = useUserStore();
  const {
    setLoading: setPropertyLoading,
    setProperties,
    setForm,
  } = usePropertyStore();
  const { setLoading: setImageLoading, setImages } = useImageStore();

  // Fetch Admin datas
  useEffect(() => {
    const fetchAdmin = async () => {
      setAdminLoading(true);
      try {
        const admin = await getAdminDb();
        if (admin) setUser(admin);
      } catch (error) {
        console.error("Error fetching admin:", error);
      } finally {
        setAdminLoading(false);
      }
    };

    const fetchProperties = async () => {
      setPropertyLoading(true, false);
      try {
        const properties = await getPropertiesDb();
        if (properties) setProperties(properties);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setPropertyLoading(false, false);
      }
    };

    const fetchImages = async () => {
      setImageLoading(true, false);
      try {
        const images = await getImagesDb();
        if (images) setImages(images);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setImageLoading(false, false);
      }
    };

    fetchAdmin();
    fetchImages();
    fetchProperties();
  }, [
    setImageLoading,
    setImages,
    setPropertyLoading,
    setProperties,
    setUser,
    setAdminLoading,
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
        <footer className="flex">
          <div className="flex justify-center">
            {/* <p className="text-sm">
              &copy; copy right Agbara Badagry Property Center
            </p> */}
          </div>
        </footer>
      </div>
    </div>
  );
}
