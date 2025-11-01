"use client";

import { Badge } from "./ui/badge";
import { motion } from "framer-motion";
import Modal from "./Modal";
import { Button } from "./ui/button";
import { ArrowLeft} from "lucide-react";
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

    const onUpdateStatus = (id: string = "", status: RequestTypes["status"]) => {
        if (!id) return;

        showSuccess(
            "Request Updated",
            status === "Contacted"
                ? "Request marked as contacted ✅"
                : "Request closed 🗂️"
        );

        handleModal(false);
    };

    const view = () => {
        handleModal(true);
        // Update the view field
    };

    return (
        <div className="w-full">
            {/* Short  */}
            <motion.button
                key={req.id}
                whileHover={{ scale: 1.01 }}
                className={`border rounded-lg p-4 cursor-pointer hover:shadow-md shadow ${!req.view ? "shadow-red-300 border-red-50" : ""} transition`}
                onClick={view}
                type="button"
            >
                {/* Title + Status */}
                <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-base truncate max-w-[260px]">
                        {req.propertyTitle}
                    </h3>
                    <Displayadge req={req} />
                </div>

                {/* Client Info */}
                <div>
                    <p className="font-medium text-xs text-slate-600">
                        Ref ID: <span>{req.referenceId}</span>
                    </p>
                    <p className="mt-2 text-base">
                        <span className="font-medium">{req.clientName}</span> •{" "}
                        {req.clientEmail}
                    </p>
                </div>
                {/* Reference Date */}
                <div>
                    <p className="text-xs text-gray-400 mt-2">
                        {formatDistanceToNow(req.createdAt, {
                            addSuffix: true,
                        })}
                    </p>
                </div>
            </motion.button>

            {/* Full */}
            <Modal open={open} setOpen={handleModal}>
                <DrawerHeader className="relative flex justify-between items-center">
                    <div className="absolute left-2 top-0">
                        <Button
                            type="button"
                            variant="ghost"
                            datatype="icon"
                            className="rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 cursor-pointer"
                            onClick={() => handleModal(false)}
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
                            <p className="text-sm pl-1">
                                {req.propertyTitle}
                            </p>
                        </div>

                        <div>
                            <h3 className="capitalize font-medium text-base mb-1">
                                Reference ID
                            </h3>
                            <p className="text-sm pl-1">
                                {req.referenceId}
                            </p>
                        </div>

                        <div className="flex flex-wrap md:justify-between gap-4">
                            <div>
                                <h3 className="capitalize font-medium text-base mb-1">
                                    Client Name
                                </h3>
                                <p className="text-sm pl-1">
                                    {req.clientName}
                                </p>
                            </div>
                            <div>
                                <h3 className="capitalize font-medium text-base mb-1">
                                    Client Email
                                </h3>
                                <p className="text-sm pl-1">
                                    {req.clientEmail}
                                </p>
                            </div>
                            {req.clientPhone && (
                                <div>
                                    <h3 className="capitalize font-medium text-base mb-1">
                                        Phone
                                    </h3>
                                    <p className="text-sm pl-1">
                                        {req.clientPhone}
                                    </p>
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

                <DrawerFooter className="w-full">
                    <div className="flex flex-col gap-3">
                        {req.status !== "Contacted" && (
                            <Button
                                className="w-full cursor-pointer bg-red-600 hover:bg-red-700"
                                onClick={() => onUpdateStatus(req.id, "Contacted")}
                            >
                                Mark as Contacted
                            </Button>
                        )}
                        <Button
                            className="w-full cursor-pointer hover:bg-red-50"
                            variant="outline"
                            onClick={() => onUpdateStatus(req.id, "Closed")}
                        >
                            Mark as Close
                        </Button>
                    </div>
                </DrawerFooter>
            </Modal>
    </div>
    );
}
