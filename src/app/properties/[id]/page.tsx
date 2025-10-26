"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PropertyTypes } from "@/types/property.types";
import Property from "@/components/property/Index";
import { sampleProperties } from "@/data/property";
import { ChevronLeft } from "lucide-react";
import ClientCard from "@/components/property/ClientCard";

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const [property, setProperty] = useState<PropertyTypes | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    setProperty(sampleProperties.find((p) => p.id === id));
  }, [id]);

  if (!property) return <p className="p-6">Loading property...</p>;

  return <div className="w-full p-2">
    <menu className="w-full mb-4">
      <button
        className="text-primary font-medium text-nowrap whitespace-pre flex items-center"
        onClick={() => router.back()}
      >
        <ChevronLeft size={30} /> Return back
      </button>
    </menu>
    {/* Full property details */}
    <section className="w-full">
      <Property
        property={property}
        viewer="ADMIN"
        placeViewing="CLIENT"
      />
    </section>
    <section className="py-10 bg-white mt-8">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {
            sampleProperties?.length ?
              sampleProperties.map((p) =>
                <ClientCard key={p.id} property={p} />
              ) :
              <div>loading</div>
          }
        </div>
      </div>
    </section>
  </div>
};

