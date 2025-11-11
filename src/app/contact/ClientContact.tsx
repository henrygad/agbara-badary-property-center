"use client"

import dynamic from "next/dynamic";

export default function ClientContact() {
     // Import the Map dynamically (no SSR)
        const ContactMap = dynamic(() => import("@/components/ContactMap"), {
            ssr: false,
        });
    
    return <>
        <ContactMap />
    </>
}
