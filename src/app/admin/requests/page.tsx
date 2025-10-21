"use client";
import RequestCrad from "@/components/RequestCrad";
import RequestTypes from "@/types/request.types";

const mockRequests: RequestTypes[] = [
  {
    id: "r1",
    clientName: "John Doe",
    clientEmail: "john@example.com",
    clientPhone: "08012345678",
    message: "I'm interested in this property. Please contact me.",
    createdAt: new Date(),
    propertyTitle: "Luxury 3-Bedroom Apartment in Agbara",
    propertyId: "66636363",
    clientId: "fhhfhfhfhf",
    referenceId: "PROP-12345",
    status: "Pending",
    view:false
  },
  {
    id: "r2",
    clientName: "Mary Ann",
    clientEmail: "mary@demo.com",
    clientPhone: "08165432109",
    message: "Can I schedule a viewing tomorrow?",
    createdAt: new Date(),
    propertyTitle: "Affordable 2-Bedroom Flat in Lusada",
    referenceId: "PROP-78394",
    status: "Contacted",
    propertyId: "66636363",
    clientId: "fhhfhfhfhf",
    view: true
  },
  {
    id: "r3",
    clientName: "Henry mark",
    clientEmail: "mary@demo.com",
    clientPhone: "08165432109",
    message: "Can I schedule a viewing tomorrow?",
    createdAt: new Date(),
    propertyTitle: "Affordable 2-Bedroom Flat in Lusada",
    referenceId: "PROP-78394",
    status: "Closed",
    propertyId: "66636363",
    clientId: "fhhfhfhfhf",
    view: true
  },
];

export default function AdminRequestsPage() {

  return <div className="space-y-3">
    {mockRequests.map((req) => (
      <RequestCrad
        key={req.id}
        req={req}
      />
    ))}
  </div>
}


