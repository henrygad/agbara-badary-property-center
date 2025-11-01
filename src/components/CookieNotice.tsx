"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Cookie } from "lucide-react";

export default function CookieNotice() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const seen = localStorage.getItem("cookieNoticeSeen");
        if (!seen) {
            setShow(true);
            // auto-hide after 20 seconds
            const timer = setTimeout(() => {
                handleClose();
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        localStorage.setItem("cookieNoticeSeen", "true");
        setShow(false);
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 70, damping: 15 }}
                    className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-[420px] z-50"
                >
                    <Card className="p-4 bg-white shadow-xl border rounded-2xl flex items-start gap-3">
                        <div className="mt-1">
                            <Cookie className="text-red-700" size={22} />
                        </div>
                        <div className="flex-1 text-sm text-gray-700">
                            <p>
                                We use cookies to improve your experience and keep your session secure.
                                By continuing to use this site, you agree to our use of functional cookies.
                            </p>
                            <div className="flex justify-end mt-3">
                                <Button
                                    onClick={handleClose}
                                    size="sm"
                                    className="bg-red-700 hover:bg-red-800 text-white"
                                >
                                    Seen
                                </Button>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
