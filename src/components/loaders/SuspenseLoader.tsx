"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import logo from "@/../public/images/logo.svg"

export default function SuspenseLoader({ loading }: { loading: boolean }) {
    return (loading &&
        <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-gray-900">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="w-20 h-20"
            >
                <Image src={logo} alt="Loading..." width={80} height={80} />
            </motion.div>
            <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm">
                Loading, please wait...
            </p>
        </div>
    );
}
