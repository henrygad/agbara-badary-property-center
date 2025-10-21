"use client";

import { cn } from '@/lib/utils';
import React from 'react'
import DisplayImage from '../gallery/DisplayImage';

type Props = {
    image: string,
    title: string,
    price: number
    agentName: string,
    referenceId: string
    staus: string
};

export default function AdminCard({ image, title, price, agentName, referenceId, staus }: Props) {
    return <div className="flex items-center gap-4">
        <DisplayImage
            className="h-18 w-18 rounded-md object-cover"
            src={image}
            alt={title}
            useRemove={false}
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
                        staus === "Rent" && "bg-blue-100 text-blue-700",
                        staus === "Sale" && "bg-purple-100 text-purple-700",
                        staus === "Lease" && "bg-teal-100 text-teal-700",
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
