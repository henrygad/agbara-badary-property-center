"use client";

import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react'

type Props = {
    image: string,
    title: string,
    price: number
    agentName: string,
    referenceId: string
    staus: string
};

export default function PropertyCard({ image, title, price, agentName, referenceId, staus }: Props) {
    return <div className="flex items-center gap-4">
        <Image
            src={image}
            alt={title}
            width={80}
            height={80}
            className="h-16 w-16 rounded-md object-cover"
        />
        <div className="flex flex-col">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">
                {title}
            </h3>
            <p className="text-xs text-gray-500">Agent: {agentName}</p>

            <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    {price}
                </p>

                {/* 🏷️ Property Purpose Badge (rent/sell/sold/leased) */}
                <span
                    className={cn(
                        "text-xs font-semibold px-2 py-[2px] rounded-md",
                        staus === "For Rent" && "bg-blue-100 text-blue-700",
                        staus === "For Sale" && "bg-purple-100 text-purple-700",
                        staus === "For Lease" && "bg-teal-100 text-teal-700",
                        staus === "Sold" && "bg-pink-100 text-pink-700",
                        staus === "Rented" && "bg-indigo-100 text-indigo-700",
                        staus === "Leased" && "bg-emerald-100 text-emerald-700"
                    )}
                >
                    {staus}
                </span>
            </div>

            <p className="text-xs text-gray-400 mt-1">Ref ID: {referenceId}</p>
        </div>
    </div>; 
};
