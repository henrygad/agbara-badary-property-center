"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import logo from "@/../public/images/logo.svg"

export default function PageLoader({ loading }: { loading: boolean }) {
    return (loading &&
        <div className="flex flex-col items-center justify-center py-10 h-[60vh] w-full">
            <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="w-14 h-14"
            >
                <Image src={logo} alt="Loading..." width={56} height={56} />
            </motion.div>
            <p className="mt-2 text-gray-500 text-sm">Fetching properties...</p>
        </div>
    );
}
