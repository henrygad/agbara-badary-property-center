"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PropertyTypes } from "@/types/property.types";
import Property from "@/components/property/Index";
import ClientCard from "@/components/property/ClientCard";
import ReturnBack from "@/components/ReturnBack";
import PageLoading from "@/components/loaders/PageLoader";
import { getPropertyByIdDb } from "@/lib/firebase/property_service";
import { searchPropertiesDb } from "@/lib/firebase/search_service";
import GroundLoader from "@/components/loaders/GroundLoader";
import { useUserStore } from "@/store/useUserStore";

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const { user} = useUserStore();

  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState<PropertyTypes | undefined>(undefined);

  const [loadingAlsoLike, setLoadingAlsoLike] = useState(true);
  const [alsoLikeProperpies, setAlsoLikeProperpies] = useState<PropertyTypes[]>([]);


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


  useEffect(() => {
    async function fetchAlsoLike(p: PropertyTypes) {
      try {
        const ps = await searchPropertiesDb({ status: p.status, type: p.type });
        if (ps?.length) {
          setAlsoLikeProperpies(ps)
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingAlsoLike(false);
      }
    }

    if (property) {
      fetchAlsoLike(property)
    }
  }, [property]);


  if (!property || loading) return <PageLoading loading={(!property || loading)} />;

  const viewer = user ? user.accountType.toUpperCase() as "CLIENT" | "ADMIN" | "AGENT" : "CLIENT";

  return <div className="w-full p-2">
    <menu className="w-full mb-4">
      <ReturnBack />
    </menu>
    {/* Full property details */}
    <section className="w-full">
      <Property
        property={property}
        viewer={viewer}
        placeViewing="CLIENT"
      />
    </section>
    <section className="py-10 bg-white mt-8">
      {!loadingAlsoLike ?
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...alsoLikeProperpies].map((p) =>
                <ClientCard key={p.id} property={p} />
            )
          }
        </div>
        </div> :
        <GroundLoader loading={loadingAlsoLike} />
      }
    </section>
  </div>
};

