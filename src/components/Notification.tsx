import { useNotificationStore } from "@/store/useNotificationStore";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import Modal from "./Modal";
import { useModal } from "@/hooks/useModal";
import { motion } from "framer-motion";
import { DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "./ui/drawer";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import NotificationTypes from "@/types/notification.types";
import { ReactNode } from "react";
import Link from "next/link";



export default function NotificationCard({ n }: { n: NotificationTypes }) {
    const { viewedNotification } = useNotificationStore();
    const { open, setOpen, handleModal } = useModal();

    const handleView = (id?: string) => {
        if (!id) return
        viewedNotification(id);
    };


    return <div className="w-full">
        <motion.button
            key={n.id}
            whileHover={{ scale: 1.01 }}
            onClick={() => handleView(n.id)}
            type="button"
        >
            <li
                className={`p-4 rounded-xl border transition hover:shadow-md ${n.viewed
                    ? "bg-white border-gray-200"
                    : "bg-red-50 border-red-200"
                    }`}
            >
                <div className="flex justify-between items-center">
                    <h2 className="font-medium text-gray-900">{n.title}</h2>
                    <Badge
                        variant={n.viewed ? "secondary" : "default"}
                        className={n.viewed ? "bg-gray-200 text-gray-700" : "bg-red-700 text-white"}
                    >
                        {n.viewed ? "Read" : "Unread"}
                    </Badge>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                    {n.message}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                    {formatDistanceToNow(new Date(n.createdAt), {
                        addSuffix: true,
                    })}
                </p>
            </li>
        </motion.button>

        <Modal open={open} setOpen={setOpen}>
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
                <DrawerDescription className="hidden">Manage request details</DrawerDescription>
            </DrawerHeader>


            <ScrollArea className="max-h-full overflow-auto">
                <div className="max-w-3xl mx-auto px-4 py-8">

                    <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                            <Redirect type={n.type}>
                                <h3 className="text-xl font-semibold text-gray-800">{n.title}</h3>
                                <Badge
                                    className={
                                        n.viewed ? "bg-gray-200 text-gray-700" : "bg-red-700 text-white"
                                    }
                                >
                                    {n.viewed ? "Read" : "Unread"}
                                </Badge>
                            </Redirect>
                        </div>

                        <p className="text-gray-700 leading-relaxed">{n.message}</p>

                        <p className="text-xs text-gray-400 mt-4">
                            Sent{" "}
                            {new Date(n.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>
                <ScrollBar orientation="vertical" />
            </ScrollArea>

            <DrawerFooter className="w-full hidden">
            </DrawerFooter>
        </Modal>
    </div>
};


function Redirect({ type, children }: { type: NotificationTypes["type"], children: ReactNode }) {
    let href = "";
    if (type === "New Account") {
        href = "/admin/agents";
    }


    return <Link href={href} className="outline-1">
        {children}
    </Link>
}
