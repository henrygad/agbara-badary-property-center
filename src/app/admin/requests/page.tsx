"use client";
import PageLoader from "@/components/loaders/PageLoader";
import RequestCrad from "@/components/RequestCrad";
import ReturnBack from "@/components/ReturnBack";
import { useRequestStore } from "@/store/useRequestStore";

export default function AdminRequestsPage() {
  const { requests, loading } = useRequestStore();

  if (loading) {
    return <PageLoader loading={loading} />;
  }


  return <div className="w-full">
    <menu className="mt-2 mb-5">
      <ReturnBack />
    </menu>

    {requests.length === 0 ? (
      <div className="h-full w-full flex justify-center items-center">
        <p className="text-gray-600 text-center text-sm py-10">No request yet</p>
      </div>
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


