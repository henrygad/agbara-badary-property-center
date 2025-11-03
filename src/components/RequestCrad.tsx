"use client";

import { Badge } from "./ui/badge";
import { motion } from "framer-motion";
import Modal from "./Modal";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import RequestTypes from "@/types/request.types";
import { showSuccess } from "./ui/toasts";
import { formatDate } from "@/utils";
import { useModal } from "@/hooks/useModal";
import {
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { useRequestStore } from "@/store/useRequestStore";
import { updateRequestDb } from "@/lib/firebase/request_service";
import { useState } from "react";
import OverlayLoader from "./loaders/OverlayLoader";

type Props = {
  req: RequestTypes;
};

const Displayadge = ({ req }: Props) => {
  return (
    <Badge
      className={
        req.status === "Pending"
          ? "bg-yellow-500 text-white"
          : req.status === "Contacted"
            ? "bg-gray-500 text-white"
            : "bg-zinc-300 text-red-700"
      }
    >
      {req.status}
    </Badge>
  );
};

export default function RequestCrad({ req }: Props) {
  const { open, handleModal } = useModal();
  const { updateRequest } = useRequestStore();
  const [loading, setLoading] = useState(false);

  const onUpdateStatus = async (
    req: RequestTypes,
    status: RequestTypes["status"]
  ) => {
    if (!req.id) return;
    handleModal(false);
    setLoading(true);

    if (status === "Closed") {
      const r = await updateRequestDb(req.id, { status });
      updateRequest(r);
      showSuccess("Request marked as contacted ✅");
    } else if (status === "Contacted") {
      const r = await updateRequestDb(req.id, { status });
      updateRequest(r);
      showSuccess("Request closed 🗂️");
    }
    setLoading(false);
  };

  const handleViewed = (req: RequestTypes) => {
    if (!req.id) return;
    handleModal(true);
    // Update in db
    if (req.view === true) return;
    updateRequestDb(req.id, { view: true });
  };

  return (
    <>
      <motion.li
        key={req.id}
        whileHover={{ scale: 1.01 }}
        onClick={() => {
          handleViewed(req);
        }}
        className="w-full cursor-pointer"
      >
        <div
          className={`p-4 rounded-xl border transition hover:shadow-md ${
            req.view ? "border-gray-200" : "border-2 border-red-400"
          }`}
        >
          <div className="flex justify-between items-center gap-3">
            <div className="spce-y-1">
              <h2 className="font-medium">{req.propertyTitle}</h2>
              <p className="font-medium text-xs text-slate-500">
                Ref ID: <span>{req.referenceId}</span>
              </p>
            </div>
            <Displayadge req={req} />
          </div>
          <div className="flex justify-between items-center gap-3 mt-3 w-full">
            <p className="text-sm">
              <span className="font-medium">{req.clientName}</span> •{" "}
              {req.clientEmail}
            </p>
            <div>
              <p className="text-xs text-gray-400 mt-2 w-full text-start">
                {formatDistanceToNow(new Date(req.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        </div>
      </motion.li>

      {/* Full */}
      <Modal
        open={open}
        setOpen={(v) => {
          handleModal(v);
          if (!req.view) {
            updateRequest({ ...req, view: true });
          }
        }}
      >
        <DrawerHeader className="relative flex justify-between items-center">
          <div className="absolute left-2 top-0">
            <Button
              type="button"
              variant="ghost"
              datatype="icon"
              className="rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 cursor-pointer"
              onClick={() => {
                handleModal(false);
                if (!req.view) {
                  updateRequest({ ...req, view: true });
                }
              }}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>
          <DrawerTitle>Request Details</DrawerTitle>
          <DrawerDescription>Manage request details</DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="max-h-full overflow-auto">
          <div className="space-y-6 text-sm px-4">
            <div>
              <h3 className="capitalize font-medium text-base mb-1">
                Property Title
              </h3>
              <p className="text-sm pl-1">{req.propertyTitle}</p>
            </div>

            <div>
              <h3 className="capitalize font-medium text-base mb-1">
                Reference ID
              </h3>
              <p className="text-sm pl-1">{req.referenceId}</p>
            </div>

            <div className="flex flex-wrap md:justify-between gap-4">
              <div>
                <h3 className="capitalize font-medium text-base mb-1">
                  Client Name
                </h3>
                <p className="text-sm pl-1">{req.clientName}</p>
              </div>
              <div>
                <h3 className="capitalize font-medium text-base mb-1">
                  Client Email
                </h3>
                <p className="text-sm pl-1">{req.clientEmail}</p>
              </div>
              {req.clientPhone && (
                <div>
                  <h3 className="capitalize font-medium text-base mb-1">
                    Phone
                  </h3>
                  <p className="text-sm pl-1">{req.clientPhone}</p>
                </div>
              )}
            </div>

            <div>
              <h3 className="font-medium text-base mb-1">Message</h3>
              <div className="max-h-[100px] overflow-y-auto">
                <p className="bg-muted/20 px-2 py-4 rounded-md text-wrap">
                  {req.message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Displayadge req={req} />
              <p className="text-xs">{formatDate(req.createdAt)}</p>
            </div>
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>

        {req.status !== "Closed" && (
          <DrawerFooter className="w-full">
            <div className="flex flex-col gap-3">
              {req.status !== "Contacted" && (
                <Button
                  className="w-full cursor-pointer bg-red-600 hover:bg-red-700"
                  onClick={() => onUpdateStatus(req, "Contacted")}
                >
                  Mark as Contacted
                </Button>
              )}
              <Button
                className="w-full cursor-pointer hover:bg-red-50"
                variant="outline"
                onClick={() => onUpdateStatus(req, "Closed")}
              >
                Mark as Close
              </Button>
            </div>
          </DrawerFooter>
        )}
      </Modal>

      <OverlayLoader loading={loading} />
    </>
  );
}
