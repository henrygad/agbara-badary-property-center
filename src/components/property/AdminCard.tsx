"use client";

import React from 'react'
import DisplayImage from '../gallery/DisplayImage';
import Status from './Status';
import { PropertyTypes } from '@/types/property.types';

export default function AdminCard({property}: {property: PropertyTypes}) {
    return <div className="flex items-center gap-4">
        <DisplayImage
            className="h-18 w-18 rounded-md object-cover"
            src={property.images[0] || ""}
            alt={property.title}
            useRemove={false}
        />
        <div className="flex flex-col">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">
                {property.title}
            </h3>
            <p className="text-xs text-gray-500">Agent: {property.agentName}</p>

            <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    {property.price}
                </p>

                {/*Property Purpose Badge (rent/sell/sold/leased) */}
                <Status status={property.status} />
            </div>

            <p className="text-xs text-gray-400 mt-1">Ref ID: {property.referenceId}</p>
        </div>
    </div>;
};
