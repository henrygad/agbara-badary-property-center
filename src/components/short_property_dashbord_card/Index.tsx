"use client";

import { PropertyTypes } from "@/types/property.types";
import PropertyCard from "./PropertyCard";

type Props = {
    properties: PropertyTypes[]
    addMoreProperties: () => void
    loadingInitial: boolean
    loadingMore: boolean
};

export default function ShortPropertyDashbordCard(
    { properties, loadingInitial }:
        Props
) {   

    if (loadingInitial) {
        return <div>Loading...</div>;
    }

    return <div className="flex flex-col gap-4">
        {
            properties.length ?
                properties.map(p =>
                    <PropertyCard key={p.id} {...p} />
                ) :
                <div>No property listed yet</div>
        }
    </div>
}

