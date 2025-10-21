"use client";

import { useEffect, useState } from "react";
import useLockScroll from "./useLockScroll";
import { useRouter } from "next/navigation";

export const useModal = () => {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    // Disable page from scrolling
    useLockScroll({ open });

    const handleModal = (v: boolean) => {
        if (v) {
            // Add modal to the nav history            
            window.history.pushState({ modal: true }, "");
            setOpen(true); // Open modal
        } else {
            setOpen(false); // Close the modal
            router.back(); // Clean up history
        }
    };

    // ESC key closes
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && open) {
                setOpen(false);
            }
        };

        window.addEventListener("keydown", onKey);
        return () => {
            window.removeEventListener("keydown", onKey);
        };
    }, [open]);

    // Change on popstate
    useEffect(() => {
        const handlePopState = () => {
            setOpen(false); // Close the modal
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
            // remove extra state when modal closes
            if (window.history.state?.modal) {
                router.back();
            }
        };
    }, [router]);
    return {
        open,
        setOpen,
        handleModal
    }
}
