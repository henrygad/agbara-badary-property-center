import { cn } from '@/lib/utils'
import { PropertyTypes } from '@/types/property.types'
import React from 'react'
import { Badge } from '../ui/badge'

export default function Availability({ availability, placeViewing }: { availability: PropertyTypes["availability"], placeViewing: "PREVIEW" | "CLIENT" }) {
    return <Badge
        className={cn(
            availability === "Accepted" && "bg-green-500 text-white",
            availability === "Pending" && "bg-yellow-500 text-white",
            availability === "Rejected" && "bg-red-500 text-white",
            availability === "Reviewing" && "bg-blue-500 text-white"
        )}
    >
        {placeViewing === "CLIENT" && availability === "Accepted" ? "Verified" : availability}
    </Badge>
}
