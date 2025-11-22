"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { PropertyTypes } from "@/types/property.types";
import Property from "@/components/property/Index";
import ClientCard from "@/components/property/ClientCard";
import PageLoading from "@/components/loaders/PageLoader";
import { getPropertyByIdDb } from "@/lib/firebase/property_service";
import GroundLoader from "@/components/loaders/GroundLoader";
import { useUserStore } from "@/store/useUserStore";
import Script from "next/script";
import { usePropertyStore } from "@/store/usePropertyStore";

export default function ClientProperty() {
  const { id } = useParams();
  const router = useRouter();

  const { user } = useUserStore();

  const { properties, loading: alsoLikePropertiesLoading } = usePropertyStore();

  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState<PropertyTypes | undefined>(undefined);


  const alsoLikeProperties = useMemo(() => {
    return properties.filter(p =>
      p.status === property?.status &&
      p.type === property.type &&
      p.availability === property.availability
    );
  }, [property, properties]);


  useEffect(() => {
    const getPId = id?.toString()

    if (!getPId) {
      router.push("/notfound");
      return;
    }

    async function fetchProperty(id: string) {
      try {
        const p = await getPropertyByIdDb(id);
        if (p) {
          if (p.availability !== "Accepted") {
            router.push("/notfound");
            return;
          }
          setProperty(p);
        } else {
          router.push("/notfound");
          return;
        }

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty(getPId);

  }, [id, router]);


  if (!property || loading) return <PageLoading loading={(!property || loading)} />;

  const schema = {
    "@context": "https://schema.org",
    "@type": "SingleFamilyResidence",
    name: property.title,
    description: property.description,
    image: property.images[0],
    url: `https://agbarabadagrypropertycenter.com/properties/${property.id}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: property.street || "",
      addressLocality: property.city,
      addressRegion: property.state,
      addressCountry: "NG",
    },
    numberOfRooms: property.bedrooms,
    floorSize: property.area ? { "@type": "QuantitativeValue", value: property.area, unitCode: "SQM" } : undefined,
    price: property.price,
    priceCurrency: "NGN",
    availability: (property.status === "Sale" || property.status === "Rent") ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
  };

  const viewer = user ? user.accountType.toUpperCase() as "CLIENT" | "ADMIN" | "AGENT" : "CLIENT";
  return <>
    {/* Full property details */}
    <section className="w-full">
      <Property
        property={property}
        viewer={viewer}
        placeViewing="CLIENT"
      />
    </section>
    <section className="py-10 bg-white mt-8">
      {!alsoLikePropertiesLoading ?
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...alsoLikeProperties].map((p) =>
              <ClientCard key={p.id} property={p} />
            )
            }
          </div>
        </div> :
        <GroundLoader loading={alsoLikePropertiesLoading} />
      }
    </section>

    <Script
      id={`property-jsonld-${property.id}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  </>;
}
