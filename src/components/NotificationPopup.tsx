"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";

export default function NotificationPopup({ message, show, onClose }: { message: string, show: boolean, onClose: () => void }) {
   
    useEffect(() => {
        if (show) {
            const timer = setTimeout(onClose, 5000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.3 }}
                    className="fixed bottom-6 right-6 z-50"
                >
                    <div className="flex items-center gap-3 bg-white border border-gray-200 shadow-lg rounded-xl px-4 py-3 w-80">
                        <div className="bg-red-100 text-red-700 p-2 rounded-full">
                            <Bell className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{message}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-sm font-medium"
                        >
                            ✕
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
