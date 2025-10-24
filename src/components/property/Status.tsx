import { cn } from '@/lib/utils'
import { PropertyTypes } from '@/types/property.types'
import React from 'react'
import { Badge } from '../ui/badge'

export default function Status({status}: {status: PropertyTypes["status"]}) {
    return <Badge
        className={cn(
            "text-xs font-semibold px-2 py-[2px] rounded-md",
            status === "Rent" && "bg-blue-100 text-blue-700",
            status === "Sale" && "bg-purple-100 text-purple-700",
            status === "Lease" && "bg-teal-100 text-teal-700",
            status === "Sold" && "bg-pink-100 text-pink-700",
            status === "Rented" && "bg-indigo-100 text-indigo-700",
            status === "Leased" && "bg-emerald-100 text-emerald-700"
        )}
    >
        For {status}
    </Badge>
}
