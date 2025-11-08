"use client";
import ItemNotFound from "@/components/ItemNotFound";
import PageLoader from "@/components/loaders/PageLoader";
import RequestCrad from "@/components/RequestCrad";
import { useRequestStore } from "@/store/useRequestStore";

export default function AdminRequestsPage() {
  const { requests, loading } = useRequestStore();

  if (loading) {
    return <PageLoader loading={loading} />;
  }


  return <div className="w-full">  
    {requests.length === 0 ? (      
      <ItemNotFound>No Request yet.</ItemNotFound>      
    ) : (
      <ul className="space-y-3">
        {requests.map((req) => (
          <RequestCrad
            key={req.id}
            req={req}
          />
        ))}
      </ul>
    )}
  </div>
}


