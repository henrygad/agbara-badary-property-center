"use client";

import { PropertyTypes } from "@/types/property.types";
import { useEffect, useState } from "react";
import PropertyCard from "./PropertyCard";
import { getProperties } from "@/lib/firebase/property_service";

export default function ShortPropertyDashbordCard() {
    const [properties, setProperties] = useState<PropertyTypes[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {        
        const fetchProperties = async () => {
            setLoading(true);
            try {
                const properties = await getProperties();
                setProperties(properties);
            } catch (error) {
                console.error("Error fetching properties:", error);
            } finally {
                setLoading(false);
            }
        };

       fetchProperties();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return <div className="flex flex-col gap-4">
        {
            properties.length ?
                properties.map(p =>
                    <PropertyCard key={p.title} {...p} />
                ) :
                <div>No property listed yet</div>
        }
    </div>
}