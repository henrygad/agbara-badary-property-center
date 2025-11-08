import { useNotificationStore } from "@/store/useNotificationStore";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import Modal from "./Modal";
import { useModal } from "@/hooks/useModal";
import { motion } from "framer-motion";
import {
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "./ui/drawer";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import NotificationTypes from "@/types/notification.types";
import { ReactNode } from "react";
import Link from "next/link";
import { updateNotificationDb } from "@/lib/firebase/notification._service";

export default function NotificationCard({ n }: { n: NotificationTypes }) {
    const { viewedNotification } = useNotificationStore();
    const { open, handleModal } = useModal();

    const handleView = (n: NotificationTypes) => {
        if (!n.id) return;
        viewedNotification(n.id);
        handleModal(true);

        if (n.viewed === true) return;
        // Update in db
        updateNotificationDb(n.id, { viewed: true });
    };

    return (
        <>
            <motion.li
                key={n.id}
                whileHover={{ scale: 1.01 }}
                onClick={() => handleView(n)}
                className="w-full cursor-pointer"
            >
                <div
                    className={`p-4 rounded-xl border transition hover:shadow-md ${n.viewed ? "border-gray-200" : "border-2 border-red-400"
                        }`}
                >
                    <div className="flex justify-between items-center">
                        <h2 className="font-medium">{n.title}</h2>
                        <Badge
                            variant={n.viewed ? "secondary" : "default"}
                            className={
                                n.viewed ? "bg-gray-200 text-gray-700" : "bg-red-700 text-white"
                            }
                        >
                            {n.viewed ? "Read" : "Unread"}
                        </Badge>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-2 w-full text-start">
                        {formatDistanceToNow(new Date(n.createdAt), {
                            addSuffix: true,
                        })}
                    </p>
                </div>
            </motion.li>

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
                    <DrawerTitle>Notification Details</DrawerTitle>
                    <DrawerDescription className="hidden">
                        Manage request details
                    </DrawerDescription>
                </DrawerHeader>

                <ScrollArea className="max-h-full overflow-auto">
                    <div className="mx-auto px-4 py-">
                        <Redirect type={n.type}>
                            <div className="space-y-2 p-4 mb-10">
                                <h3 className="text-lg font-semibold">
                                    {n.title}
                                </h3>
                                <p className="leading-relaxed text-sm">
                                    {n.message}
                                </p>

                                <div className="mb-4"></div>
                                <p className="text-xs text-gray-500 mt-4">
                                    Sent {new Date(n.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </Redirect>
                    </div>
                    <ScrollBar orientation="vertical" />
                </ScrollArea>

                <DrawerFooter className="w-full hidden"></DrawerFooter>
            </Modal>
    </>
    );
}

function Redirect({
    type,
    children,
}: {
    type: NotificationTypes["type"];
    children: ReactNode;
}) {
    let href = "";
    if (type === "New Account") {
        href = "/admin/agents";
    } else if (type === "Request") {
        href = "/admin/requests"
    } else if (type === "Listed Property") {
        href = "/admin/properties?tab=Agent";
    } else if (type === "Property") {
        href = "/agent/properties?tab=Agent";
    }

    return <Link href={href}>{children}</Link>;
}
