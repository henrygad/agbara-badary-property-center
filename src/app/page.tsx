"use client";
import { getImagesDb } from "@/lib/firebase/image_service";
import { getPropertiesDb } from "@/lib/firebase/property_service";
import { useImageStore } from "@/store/useImageStore";
import { usePropertyStore } from "@/store/usePropertyStore";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  const { setLoading: setPropertyLoading, setProperties} = usePropertyStore();
  const { setLoading: setImageLoading, setImages} = useImageStore();

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
    <>
      <header className="flex flex-col font-mon">
        <ul className="inline-flex gap-10 p-4 border">
          <li>Home</li>
          <li>projects</li>
          <li>
            <Link href="/admin" >Admin</Link>

          </li>
        </ul>
      </header>
      <main className="flex flex-col items-center p-8">
        <h1>How are you</h1>
      </main>
      <footer className="flex">
        <div className="flex justify-center">
          <p>&copy; copy right Agbara Badagry Property Center</p>
        </div>
      </footer>
    </>
  );
}
