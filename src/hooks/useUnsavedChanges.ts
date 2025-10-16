"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

export type GuardOptions = {
    // when true, guard is active (form is dirty)
    when: boolean;
    // callback to persist draft (sync or async)
    onSaveDraft?: () => void | Promise<void>;
    // array of guarded paths (exact match or prefix)
    guardedPaths?: string[]; // default ['/admin/add-property', '/admin/edit-property']
};

export default function useUnsavedChanges({
    when,
    onSaveDraft,
    guardedPaths = ["/admin/add-property", "/admin/edit-property"],
}: GuardOptions) {
    const router = useRouter();
    const pathname = usePathname();
    const [openPrompt, setOpenPrompt] = useState(false);

    // refs to hold pending navigation info
    const pendingUrlRef = useRef<string | null>(null);
    const pendingActionRef = useRef<"link" | "back" | null>(null);
    const allowNavigationRef = useRef(false);

    // helper: check if current pathname is inside guardedPaths
    const isOnGuardedPath = useCallback(() => {
        if (!pathname) return false;
        return guardedPaths.some((p) => {
            // allow prefix match (so '/admin/edit-property/123' matches '/admin/edit-property')
            return pathname === p || pathname.startsWith(p + "/") || pathname.startsWith(p);
        });
    }, [pathname, guardedPaths]);

    // ----- intercept anchor clicks (capture phase) -----
    useEffect(() => {
        if (!when) return;

        const handleClick = (e: MouseEvent) => {
            if (!isOnGuardedPath() || allowNavigationRef.current) return;

            const target = e.target as HTMLElement | null;
            const anchor = target?.closest?.("a") as HTMLAnchorElement | null;
            if (!anchor) return;

            // do not intercept links that open new tab or external
            const href = anchor.getAttribute("href");
            const targetAttr = anchor.getAttribute("target");
            if (!href || href.startsWith("#") || targetAttr === "_blank") return;

            try {
                const url = new URL(href, window.location.href);
                if (url.origin !== window.location.origin) return; // external
                const relativePath = url.pathname + url.search + url.hash;
                if (relativePath === pathname) return; // same page

                // intercept
                e.preventDefault();
                pendingUrlRef.current = relativePath;
                pendingActionRef.current = "link";
                setOpenPrompt(true);
            } catch {
                // ignore malformed href
            }
        };

        // capture = true so we run before Next's Link handler
        document.addEventListener("click", handleClick, true);
        return () => document.removeEventListener("click", handleClick, true);
    }, [when, pathname, isOnGuardedPath]);


    // ----- intercept back/forward (popstate) -----
    useEffect(() => {
        console.log(window.history.state?.modal, "in");
        if (!when || !isOnGuardedPath() || window.history.state?.modal) return;

        // push a guard entry so first Back triggers popstate and leaves us control
        window.history.pushState({ __nav_guard: true }, "", window.location.href);

        const onPop = () => {
            if (!when || allowNavigationRef.current) {
                allowNavigationRef.current = false;
                return;
            }
            // mark pending as back action
            pendingActionRef.current = "back";
            pendingUrlRef.current = null;
            setOpenPrompt(true);
            // push guard again to remain on page while dialog open
            window.history.pushState({ __nav_guard: true }, "", window.location.href);
        };

        window.addEventListener("popstate", onPop);
        return () => {
            window.removeEventListener("popstate", onPop);
        };

    }, [when, pathname, isOnGuardedPath]);

    // ----- auto save draft on unload (silent) -----
    useEffect(() => {
        if (!onSaveDraft) return;

        const onBeforeUnload = () => {
            if (!when) return;
            onSaveDraft();
        };

        window.addEventListener("beforeunload", onBeforeUnload);
        return () => window.removeEventListener("beforeunload", onBeforeUnload);
    }, [when, onSaveDraft]);

    // helper to actually perform the navigation after confirmation
    const navigateOut = useCallback(() => {
        allowNavigationRef.current = true;

        if (pendingActionRef.current === "back") {
            // go back two steps to escape the guard entry(s)
            setTimeout(() => {
                try {
                    window.history.go(-2);
                } catch {
                    // fallback
                    const ref = document.referrer;
                    if (ref) window.location.href = ref;
                    else window.location.href = "/";
                }
            }, 10);
        } else if (pendingActionRef.current === "link" && pendingUrlRef.current) {
            const url = pendingUrlRef.current;
            setTimeout(() => {
                router.push(url);
            }, 10);
        }

        // reset
        pendingActionRef.current = null;
        pendingUrlRef.current = null;
    }, [router]);

    // called when user chooses "Leave without saving"
    const leaveWithoutSaving = useCallback(() => {
        setOpenPrompt(false);
        navigateOut();
    }, [navigateOut]);

    // called when user chooses "Save draft & leave"
    const saveDraftAndLeave = useCallback(async () => {
        setOpenPrompt(false);
        if (onSaveDraft) onSaveDraft();
        navigateOut();
    }, [navigateOut, onSaveDraft]);


    // Programmatic navigation helper — to be used instead of router.push()
    const requestNavigation = useCallback(
        (url: string) => {
            if (!when || !isOnGuardedPath() || allowNavigationRef.current) {
                // no guard: navigate immediately
                router.push(url);
                return;
            }
            // otherwise set pending & show prompt
            pendingActionRef.current = "link";
            pendingUrlRef.current = url;
            setOpenPrompt(true);
        },
        [when, isOnGuardedPath, router]
    );

    return {
        openPrompt,
        setOpenPrompt,
        leaveWithoutSaving,
        saveDraftAndLeave,
        requestNavigation,
    };
};

