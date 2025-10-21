
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { ReactElement } from "react";

type Props = {
    open: boolean
    setOpen: (open: boolean) => void
    children: ReactElement,
    className?: string
}


export default function Modal({ open, setOpen, children, className  }: Props) {
    const dragControls = useDragControls();

    return (
        <AnimatePresence >
            {open && <>
                {/* Overlay */}
                <motion.div
                    className="fixed inset-0 bg-black/40 z-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setOpen(false)}
                />

                {/* Bottom sheet modal */}
                <motion.div
                    drag="y"
                    dragControls={dragControls}
                    dragListener={false}
                    onDragEnd={(e, info) => {
                        if (info.offset.y > 120) setOpen(false);
                    }}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", stiffness: 180, damping: 22 }}
                    className={cn("fixed bottom-0 left-0 right-0 z-50 text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 rounded-t-2xl shadow-2xl border-t border-border py-2 max-h-[90vh] overflow-y-hidden", className)}
                >
                    <div
                        className="w-12 h-1.5 bg-muted-foreground/30 rounded-full mx-auto mb-4 cursor-grab"
                        onPointerDown={(e) => dragControls.start(e)}
                    ></div>
                    {/* Content */}

                    {children}                    

                </motion.div>
            </>}
        </AnimatePresence>
    );
}
