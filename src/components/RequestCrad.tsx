"use client";

import { Badge } from './ui/badge'
import { motion } from "framer-motion";
import Modal from './Modal';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import RequestTypes from '@/types/request.types';
import { showSuccess } from './ui/toasts';
import { formatDate } from '@/utils';
import { useModal } from '@/hooks/useModal';


type Props = {
    req: RequestTypes
}


const Displayadge = ({ req }: Props) => {
    return <Badge
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
};

export default function RequestCrad({ req }: Props) {
    const { open, handleModal } = useModal()


    const onUpdateStatus = (id: string = "", status: RequestTypes["status"]) => {
        if (!id) return;


        showSuccess("Request Updated",
            status === "Contacted"
                ? "Request marked as contacted ✅"
                : "Request closed 🗂️"
        );

        handleModal(false);
    };

    const view = () => {
        handleModal(true)
        // Update the view field
    };

    return <div className='flex-1 w-full'>
        {/* Short  */}
        <motion.div
            key={req.id}
            whileHover={{ scale: 1.01 }}
            className={`border rounded-lg p-4 cursor-pointer hover:shadow-md shadow ${!req.view ? "shadow-red-300 border-red-50" : ""} transition`}
            onClick={view}
        >
            {/* Title + Status */}
            <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-base truncate max-w-[260px]">
                    {req.propertyTitle}
                </h3>
                <Displayadge req={req} />
            </div>

            {/* Client Info */}
            <div className="text-sm mb-1">
                <p>
                    <span className="font-medium">
                        {req.clientName}
                    </span>{" "}
                    • {req.clientEmail}
                </p>
            </div>
            {/* Reference ID + Date */}
            <div className="flex justify-between">
                <p className="font-medium text-xs text-slate-400">
                    Ref ID:{" "}
                    <span>{req.referenceId}</span>
                </p>
                <p className="text-xs">
                    {formatDate(req.createdAt)}
                </p>
            </div>
        </motion.div>

        {/* Full */}
        <Modal
            open={open}
            setOpen={handleModal}
        >
            <div className="w-full min-h-full max-w-full overflow-y-auto px-3 sm:px-6 py-4">
                <div className="relative flex items-start justify-between mb-4">
                    <div className='flex-1 flex flex-col items-center justify-center'>
                        <h2 className="text-lg font-semibold text-red-600">
                            Request Details
                        </h2>
                        <p className="text-sm text-slate-500">View and manage request details</p>
                    </div>

                    <div className='absolute right-4 top-0'>
                        <Button variant="ghost" size="icon" onClick={() => handleModal(false)}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="space-y-6 text-sm">
                    <div>
                        <h3 className="capitalize font-medium text-base mb-1">Property Title</h3>
                        <p className="text-sm text-wrap dark:text-slate-400 pl-1">{req.propertyTitle}</p>
                    </div>

                    <div>
                        <h3 className="capitalize font-medium text-base mb-1">Reference ID</h3>
                        <p className="text-sm dark:text-slate-400 pl-1">{req.referenceId}</p>
                    </div>

                    <div className="flex flex-wrap md:justify-between gap-4">
                        <div>
                            <h3 className="capitalize font-medium text-base mb-1">Client Name</h3>
                            <p className="text-sm dark:text-slate-400 pl-1">{req.clientName}</p>
                        </div>
                        <div>
                            <h3 className="capitalize font-medium text-base mb-1">Client Email</h3>
                            <p className="text-sm dark:text-slate-400 pl-1">{req.clientEmail}</p>
                        </div>
                        {req.clientPhone && (
                            <div>
                                <h3 className="capitalize font-medium text-base mb-1">Phone</h3>
                                <p className="text-sm dark:text-slate-400 pl-1">{req.clientPhone}</p>
                            </div>
                        )}
                    </div>

                    <div>
                        <h3 className="font-medium text-base mb-1">Message</h3>
                        <div className='max-h-[100px] overflow-y-auto'>
                            <p className="bg-muted/20 px-2 py-4 rounded-md text-wrap">
                                {req.message}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <Displayadge req={req} />
                        <p className="text-xs">
                            {formatDate(req.createdAt)}
                        </p>
                    </div>

                    <div className="mt-6 flex flex-col gap-3">
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
                </div>
            </div>
        </Modal>
    </div>
};

