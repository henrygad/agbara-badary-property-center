"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PropertyTypes } from "@/types/property.types";
import Property from "@/components/property/Index";
import { sampleProperties } from "@/data/property";

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const [property, setProperty] = useState<PropertyTypes | undefined>(undefined);

  useEffect(() => {
    if (!id) return;

    setProperty(sampleProperties.find((p) => p.id === id));
  }, [id]);

  if (!property) return <p className="p-6">Loading property...</p>;

  return <Property
    property={property}
    showFull={true}
    viewer="ADMIN"
    placeViewing="CLIENT"
  />
};

