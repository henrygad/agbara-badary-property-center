"use client";

import ShortPropertyDashbordCard from "@/components/property/Index";
import { usePropertyStore } from "@/store/usePropertyStore";


export default function AdminDashboard() {
    const { properties, loading, loadingMore } = usePropertyStore();

    return <div className="flex-1">
        {/* <ShortPropertyDashbordCard
                        properties={properties}
                        loadingInitial={loading}
                        loadingMore={loadingMore}
                        addMoreProperties={() => { }}
                    /> */}
        Dashboard
    </div>;
};
