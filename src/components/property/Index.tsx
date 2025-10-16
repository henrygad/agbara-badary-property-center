"use client";

import { PropertyTypes } from "@/types/property.types";

type Props = {
    properties: PropertyTypes[]
    addMoreProperties: () => void
    loadingInitial: boolean
    loadingMore: boolean
};

export default function Property( {}: Props ){
    return <div></div>;    
}

