"use client";

import ClientCard from "@/components/property/ClientCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sampleProperties } from "@/data/property";
import { ChevronLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Properties() {
  const router = useRouter();
  const query = useSearchParams();
  const {} = query;

  const tab = query.get("tab");

  return (
    <div className="w-full p-2">
      <menu className="w-full mb-4">
        <button
          className="text-primary font-medium text-nowrap whitespace-pre flex items-center"
          onClick={() => router.back()}
        >
          <ChevronLeft size={30} /> Return back
        </button>
      </menu>
      <Tabs defaultValue={tab ? tab : "All"}>
        <TabsList className="flex justify-between items-center gap-4 text-sm bg-white min-h-14 px-2 w-full max-w-full overflow-x-auto overflow-y-hidden scroll-smooth">
          <TabsTrigger
            type="button"
            value="All"
            className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:text-white cursor-pointer"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            type="button"
            value="For Sale"
            className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:text-white cursor-pointer"
          >
            For Sale
          </TabsTrigger>
          <TabsTrigger
            type="button"
            value="For Rent"
            className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:text-white cursor-pointer"
          >
            For Rent
          </TabsTrigger>
          <TabsTrigger
            type="button"
            value="Short-let"
            className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:text-white cursor-pointer"
          >
            Short-let
          </TabsTrigger>
          <TabsTrigger
            type="button"
            value="Commercial"
            className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:text-white cursor-pointer"
          >
            Commercial
          </TabsTrigger>
        </TabsList>

        <div className="py-10 bg-white">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <TabsContent value="All">
              <div className="space-y-1 mb-8">
                <h2 className="text-2xl font-bold">All Properties Available</h2>
                <p className="text-xs text-muted-foreground">
                  248 properties found
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sampleProperties?.length ? (
                  sampleProperties.map((p) => (
                    <ClientCard key={p.id} property={p} />
                  ))
                ) : (
                  <div>loading</div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="For Sale">
              <div className="space-y-1 mb-8">
                <h2 className="text-2xl font-bold">Properties for Sale</h2>
                <p className="text-xs text-muted-foreground">
                  248 properties found for Sale
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sampleProperties?.length ? (
                  sampleProperties.map((p) => (
                    <ClientCard key={p.id} property={p} />
                  ))
                ) : (
                  <div>loading</div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="For Rent">
              <div className="space-y-1 mb-8">
                <h2 className="text-2xl font-bold">Properties for Rent</h2>
                <p className="text-xs text-muted-foreground">
                  248 properties found for Rent
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sampleProperties?.length ? (
                  sampleProperties.map((p) => (
                    <ClientCard key={p.id} property={p} />
                  ))
                ) : (
                  <div>loading</div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="Short-let">
              <div className="space-y-1 mb-8">
                <h2 className="text-2xl font-bold">Properties for Short let</h2>
                <p className="text-xs text-muted-foreground">
                  248 properties found for Short let
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sampleProperties?.length ? (
                  sampleProperties.map((p) => (
                    <ClientCard key={p.id} property={p} />
                  ))
                ) : (
                  <div>loading</div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="Commercial">
              <div className="space-y-1 mb-8">
                <h2 className="text-2xl font-bold">
                  Properties for Commercial
                </h2>
                <p className="text-xs text-muted-foreground">
                  248 properties found for Commercial
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sampleProperties?.length ? (
                  sampleProperties.map((p) => (
                    <ClientCard key={p.id} property={p} />
                  ))
                ) : (
                  <div>loading</div>
                )}
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
