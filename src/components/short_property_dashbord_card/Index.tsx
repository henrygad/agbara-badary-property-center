"use client";

import { PropertyTypes } from "@/types/property.types";
import { useEffect, useState } from "react";
import PropertyCard from "./PropertyCard";
import { getProperties } from "@/lib/firebase/services";

export default function ShortPropertyDashbordCard() {
    const [properties, setProperties] = useState<PropertyTypes[]>([]);

    const fetchProperties = async () => {
        const properties = await getProperties();
        console.log(properties, "fetch from firebase");
    };

    useEffect(() => {
        setProperties(JSON.parse(localStorage.getItem("properties") || "[]") as PropertyTypes[])
       fetchProperties();
    }, []);

    return <div className="grid gap-4">
        {
            properties.length ?
                properties.map(p =>
                    <PropertyCard key={p.title} {...p} />
                ) :
                <div>No property listed yet</div>
        }
    </div>
}