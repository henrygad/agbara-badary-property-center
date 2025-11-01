"use client";

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation'
import React from 'react'

export default function ReturnBack() {
    const router = useRouter();
    return <button
        type='button'
        className="text-primary font-medium text-nowrap text-sm whitespace-pre flex items-center cursor-pointer"
        onClick={() => router.back()}
    >
        <ChevronLeft size={30} /> Return back
    </button>
}
