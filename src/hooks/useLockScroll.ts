"use client";

import { useEffect } from 'react'

const useLockScroll = ({ open }: { open: boolean }) => {
    useEffect(() => {
        // Disable body scroll when open
        if (open) {
            document.body.classList.add("overflow-hidden")
        } else {
            document.body.classList.remove("overflow-hidden")
        }

        return () => {
            document.body.classList.remove("overflow-hidden")
        }
    }, [open])

    return null;
}

export default useLockScroll