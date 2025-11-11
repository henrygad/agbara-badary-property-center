"use client";

import ItemNotFound from "@/components/ItemNotFound";
import PageLoading from "@/components/loaders/PageLoader";
import ClientCard from "@/components/property/ClientCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useClientStore } from "@/store/useClientStore";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect, useMemo, useState } from "react";

export default function ClientProperties() {
    const { properties, loading: loadingProperties } = useClientStore();
    const query = useSearchParams();

    const [tab, setTab] = useState<"Sale" | "Rent">("Sale");
    const [subTab, setSubTab] = useState<"All" | "Residential" | "Commercial" | "Industrial">("All");

    const [loadingTab, setLoadingTab] = useState(true);

    const filteredProperties = useMemo(() => {
        return properties.filter(p => p.status === tab && (subTab === "All" || p.category === subTab));
    }, [tab, subTab, properties]);


    useEffect(() => {
        const qTab = query.get("tab");
        const qSubTab = query.get("subtab");
        if (qTab) {
            setLoadingTab(true)
            setTab(qTab as "Sale" | "Rent");
        }
        if (qSubTab) {
            setLoadingTab(true)
            setSubTab(qSubTab as "All" | "Residential" | "Commercial" | "Industrial");
        }

        setLoadingTab(false);
    }, [query]);

    if (loadingProperties || loadingTab) return <PageLoading loading={(loadingProperties || loadingTab)} />;

    const schema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Properties for Sale & Rent in Agbara & Badagry",
        description:
            "Browse verified properties available for sale or rent along Agbara–Badagry expressway.",
        itemListElement: properties.map((property, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `https://agbarabadagrypropertycenter.com/properties/${property.id}`,
            name: property.title,
        })),
    };

    return <>
        <Tabs defaultValue={tab}>
            <TabsList className="flex justify-between items-center gap-4 text-sm bg-white min-h-12 p-2 w-full max-w-full overflow-x-auto overflow-y-hidden scroll-smooth">
                <TabsTrigger
                    type="button"
                    value="Sale"
                    onClick={() => setTab("Sale")}
                    className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:text-white cursor-pointer"
                >
                    Buy
                </TabsTrigger>

                <TabsTrigger
                    type="button"
                    value="Rent"
                    onClick={() => setTab("Rent")}
                    className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:text-white cursor-pointer"
                >
                    Rent
                </TabsTrigger>
            </TabsList>

            <div className="py-10 bg-white">
                <div className="mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold">Properties for {tab}</h1>
                        <p className="text-xs text-muted-foreground">
                            {filteredProperties.length} found
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-base font-semibold">Looking For</h3>
                        <div className="flex flex-wrap justify-start items-center gap-4">
                            <Button
                                className={cn("text-base font-medium transition-colors hover:bg-red-400 hover:text-white", subTab === "All" ? "bg-primary text-white" : "")}
                                variant="outline"
                                onClick={() => setSubTab("All")}
                            >
                                All
                            </Button>
                            <Button
                                className={cn("text-base font-medium transition-colors hover:bg-red-400 hover:text-white", subTab === "Residential" ? "bg-primary text-white" : "")}
                                variant="outline"
                                onClick={() => setSubTab("Residential")}
                            >
                                Residential
                            </Button>
                            <Button
                                className={cn("text-base font-medium transition-colors hover:bg-red-400 hover:text-white", subTab === "Commercial" ? "bg-primary text-white" : "")}
                                variant="outline"
                                onClick={() => setSubTab("Commercial")}
                            >
                                Commercial
                            </Button>
                            <Button
                                className={cn("text-base font-medium transition-colors hover:bg-red-400 hover:text-white", subTab === "Industrial" ? "bg-primary text-white" : "")}
                                variant="outline"
                                onClick={() => setSubTab("Industrial")}
                            >
                                Industrial
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProperties?.length ? (
                            filteredProperties.map((p) => (
                                <ClientCard key={p.id} property={p} />
                            ))
                        ) : (
                            <div className="col-span-3">
                                <ItemNotFound>No Property yet.</ItemNotFound>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </Tabs>

        <Script
            id="properties-jsonld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    </>
}
