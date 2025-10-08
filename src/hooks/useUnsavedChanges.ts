"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UnsavedChangesOptions {
    shouldBlock: boolean;
    onSaveDraft: () => void;
}

export function useUnsavedChanges({ shouldBlock, onSaveDraft }: UnsavedChangesOptions) {
    const router = useRouter();
    const [showPrompt, setShowPrompt] = useState(false);
    const [nextRoute, setNextRoute] = useState<string | null>(null);

    // Prevent closing tab or refreshing
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (shouldBlock) {
                e.preventDefault();
                e.returnValue = "";
                setShowPrompt(true);
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [shouldBlock]);

    // Prevent internal navigation
    useEffect(() => {
        const handleBeforeRouteChange = (e: PopStateEvent) => {
            if (shouldBlock) {
                e.preventDefault();
                setShowPrompt(true);
                setNextRoute(document.referrer);
                history.pushState(null, "", window.location.href); // cancel back nav
            }
        };
        window.addEventListener("popstate", handleBeforeRouteChange);
        return () => window.removeEventListener("popstate", handleBeforeRouteChange);
    }, [shouldBlock]);

    const handleLeaveWithoutSaving = () => {
        setShowPrompt(false);
        if (nextRoute) router.push(nextRoute);
    };

    const handleSaveAndLeave = async () => {
        onSaveDraft();
        setShowPrompt(false);
        if (nextRoute) router.push(nextRoute);
    };

    return {
        showPrompt,
        setShowPrompt,
        handleLeaveWithoutSaving,
        handleSaveAndLeave,
    };
}
