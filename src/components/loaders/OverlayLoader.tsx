"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import logo from "@/../public/images/logo.svg"

export default function OverlayLoader({ loading }: { loading: boolean }) {
    return (loading &&
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
                animate={{ opacity: [1, 0.6, 1], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-16 h-16"
            >
                <Image src={logo} alt="Loading..." width={64} height={64} />
            </motion.div>
            <p className="mt-3 text-white text-sm">Please wait...</p>
        </div>
    );
}
