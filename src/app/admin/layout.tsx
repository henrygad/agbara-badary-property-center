"use client";

import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { getImagesDb } from "@/lib/firebase/image_service";
import { getPropertiesDb } from "@/lib/firebase/property_service";
import { useImageStore } from "@/store/useImageStore";
import { usePropertyStore } from "@/store/usePropertyStore";
import { useEffect } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  
  const {
    setLoading: setPropertyLoading,
    setProperties,    
  } = usePropertyStore();
  const { setLoading: setImageLoading, setImages } = useImageStore();


  // Fetch Admin datas
  useEffect(() => {
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

    fetchImages();
    fetchProperties();
  }, [setImageLoading, setImages, setPropertyLoading, setProperties]);
  

  return (
    <div className="flex flex-col text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="md:ml-64 flex-1 min-h-screen">
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
