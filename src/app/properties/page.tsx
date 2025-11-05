"use client";

import PageLoading from "@/components/loaders/PageLoader";
import ClientCard from "@/components/property/ClientCard";
import ReturnBack from "@/components/ReturnBack";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClientStore } from "@/store/useClientStore";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function Properties() {
  const { properties, loading } = useClientStore();
  const query = useSearchParams(); 

  const [tab, setTab] = useState("All");

  // Filtering logic (including date filter)
  const filteredProperties = useMemo(() => {
    return properties.filter(p => tab === "All" || tab === p.status)
  }, [tab, properties]);


  useEffect(() => {
    const qTab = query.get("tab");    
    if (qTab) {
      setTab(qTab);
    }
  }, [query]);
  
  if (loading) return <PageLoading loading={(loading)} />;

  return (
    <div className="w-full p-2">
      <menu className="w-full mb-4">
        <ReturnBack />
      </menu>
      <Tabs defaultValue={tab}>
        <TabsList className="flex justify-between items-center gap-4 text-sm bg-white min-h-12 p-2 w-full max-w-full overflow-x-auto overflow-y-hidden scroll-smooth">
          <TabsTrigger
            type="button"
            value="All"
            onClick={() => setTab("All")}
            className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:text-white cursor-pointer"
          >
            All
          </TabsTrigger>

          <TabsTrigger
            type="button"
            value="Sale"
            onClick={() => setTab("Sale")}
            className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:text-white cursor-pointer"
          >
            For Sale
          </TabsTrigger>
          <TabsTrigger
            type="button"
            value="Rent"
            onClick={() => setTab("Rent")}
            className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:text-white cursor-pointer"
          >
            For Rent
          </TabsTrigger>
          <TabsTrigger
            type="button"
            value="Short-let"
            onClick={() => setTab("Short-let")}
            className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:text-white cursor-pointer"
          >
            Short-let
          </TabsTrigger>
          <TabsTrigger
            type="button"
            value="Commercial"
            onClick={() => setTab("Commercial")}
            className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:text-white cursor-pointer"
          >
            Commercial
          </TabsTrigger>
        </TabsList>

        <div className="py-10 bg-white">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-1 mb-8">
              <h2 className="text-2xl font-bold">Properties {tab == "All" ? "Available" : tab}</h2>
              <p className="text-xs text-muted-foreground">
                {filteredProperties.length} properties found
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties?.length ? (
                filteredProperties.map((p) => (
                  <ClientCard key={p.id} property={p} />
                ))
              ) : (
                <p>No properties yet</p>
              )}
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
