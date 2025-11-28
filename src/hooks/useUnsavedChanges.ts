"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

export type GuardOptions = {
    // when true, guard is active (form is dirty)
    when: boolean;
    // callback to persist draft (sync or async)
    onSaveDraft?: () => void | Promise<void>;
    // array of guarded paths (exact match or prefix)
    guardedPaths?: string[];
};

export default function useUnsavedChanges({
    when,
    onSaveDraft,
    guardedPaths
}: GuardOptions) {
    const { user, } = useUserStore();
    const router = useRouter();
    const pathname = usePathname();
    const [openPrompt, setOpenPrompt] = useState(false);

    // refs to hold pending navigation info
    const pendingUrlRef = useRef<string | null>(null);
    const pendingActionRef = useRef<"link" | "back" | null>(null);
    const allowNavigationRef = useRef(false);
    const popHandlerRef = useRef<((ev: PopStateEvent) => void) | null>(null);

    // helper: check if current pathname is inside guardedPaths
    const isOnGuardedPath = useCallback(() => {
        if (!pathname) return false;
        return guardedPaths?.some((p) => {
            return pathname === p || pathname.startsWith(p + "/") || pathname.startsWith(p);
        });
    }, [pathname, guardedPaths]);


    // helper to actually perform the navigation after confirmation
    const navigateOut = useCallback(() => {
        allowNavigationRef.current = true;

        if (pendingActionRef.current === "back") {
            // Remove pop handler so the browser back action is not intercepted.
            const handler = popHandlerRef.current;
            if (handler) {
                window.removeEventListener("popstate", handler);
                popHandlerRef.current = null;
            }

            // Give browser a moment, then go back once.
            // We only call back once because we maintain only one real prior entry.
            setTimeout(() => {
                try {
                    router.push(user?.accountType === "Admin" ? "/admin" : "/agent");
                    // router.back()
                } catch {
                    const ref = document.referrer;
                    if (ref) window.location.href = ref;
                    else window.location.href = "/";
                }
            }, 10);
        } else if (pendingActionRef.current === "link" && pendingUrlRef.current) {
            const url = pendingUrlRef.current;
            // Remove pop handler to avoid any race with history events
            const handler = popHandlerRef.current;
            if (handler) {
                window.removeEventListener("popstate", handler);
                popHandlerRef.current = null;
            }

            setTimeout(() => {
                router.push(url);
            }, 10);
        }

        // reset
        pendingActionRef.current = null;
        pendingUrlRef.current = null;
    }, [router, user?.accountType]);
    
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
        if (!when || !isOnGuardedPath()) return;

        // push a guard entry so first Back triggers popstate and leaves us control
        window.history.pushState({ __nav_guard: true }, "", window.location.href);

        const onPop = () => {
            if (!when || allowNavigationRef.current) {
                // reset guard flag so next time we don't accidentally block real navigation
                allowNavigationRef.current = false;
                return;
            }

            // mark pending as back action and show prompt
            pendingActionRef.current = "back";
            pendingUrlRef.current = null;
            setOpenPrompt(true);

            // push guard again so the user remains on the page while the dialog is open
            // (we keep one guard in the stack)
            try {
                window.history.pushState({ __nav_guard: true }, "", window.location.href);
            } catch { }
        };

        popHandlerRef.current = onPop;
        window.addEventListener("popstate", onPop);

        return () => {
            const handler = popHandlerRef.current;
            if (handler) window.removeEventListener("popstate", handler);
            popHandlerRef.current = null;
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

