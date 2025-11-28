"use client";

import { motion } from "framer-motion";

export default function GroundLoader({ loading }: { loading: boolean }) {
    return (loading &&
        <div className="flex items-center justify-center py-4 h-full flex-1 w-full">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full" />
            </motion.div>
            {/* <span className="text-gray-500 text-sm">Loading...</span> */}
        </div>
    );
}
