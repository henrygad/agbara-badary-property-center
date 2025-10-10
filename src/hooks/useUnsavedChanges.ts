"use client";

import { useEffect } from "react";

interface UseUnsavedChangesOptions {
    shouldBlock: boolean;
    onSaveDraft?: () => void | Promise<void>;
    guardedPath?: string;
}

export function useUnsavedChanges({
    shouldBlock,
    onSaveDraft,
    guardedPath = "/admin/add-property",
}: UseUnsavedChangesOptions) {

    useEffect(() => {
        const handleBeforeUnload = () => {
            if (shouldBlock && onSaveDraft && guardedPath) {
                onSaveDraft();
            };
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [shouldBlock, onSaveDraft, guardedPath]);
}

// export function useUnsavedChanges({
//     shouldBlock,
//     onSaveDraft,
//     guardedPath = "/admin/add-property",
// }: UseUnsavedChangesOptions) {
//     const router = useRouter();
//     const pathname = usePathname();
//     const [showPrompt, setShowPrompt] = useState(false);

//     const pendingUrlRef = useRef<string | null>(null);
//     const pendingActionRef = useRef<"link" | "back" | null>(null);
//     const allowNavigationRef = useRef(false);
//     const popInterceptedRef = useRef(false); // track if popstate interception happened

//     // Intercept internal link clicks (capture phase)
//     useEffect(() => {
//         if (pathname !== guardedPath) return;

//         const handleClick = (e: MouseEvent) => {
//             if (!shouldBlock || allowNavigationRef.current) return;

//             const target = e.target as HTMLElement | null;
//             const anchor = target?.closest?.("a") as HTMLAnchorElement | null;
//             if (!anchor) return;

//             const href = anchor.getAttribute("href");
//             const targetAttr = anchor.getAttribute("target");

//             if (!href || href.startsWith("#") || targetAttr === "_blank") return;

//             try {
//                 const url = new URL(href, window.location.href);
//                 if (url.origin !== window.location.origin) return;

//                 const relativePath = url.pathname + url.search + url.hash;
//                 if (relativePath !== pathname) {
//                     e.preventDefault();
//                     pendingUrlRef.current = relativePath;
//                     pendingActionRef.current = "link";
//                     setShowPrompt(true);
//                 }
//             } catch {
//                 // ignore invalid hrefs
//             }
//         };

//         document.addEventListener("click", handleClick, true);
//         return () => document.removeEventListener("click", handleClick, true);
//     }, [shouldBlock, pathname, guardedPath]);

//     // Intercept back/forward (popstate)
//     useEffect(() => {
//         if (pathname !== guardedPath) return;

//         // push one guard entry so first back triggers popstate and we can intercept
//         window.history.pushState({ __guard: true }, "", window.location.href);

//         const handlePopState = () => {
//             if (!shouldBlock || allowNavigationRef.current) {
//                 // reset flag and allow normal navigation
//                 allowNavigationRef.current = false;
//                 return;
//             }

//             // mark that popstate occurred and we intercepted it
//             pendingActionRef.current = "back";
//             pendingUrlRef.current = null;
//             popInterceptedRef.current = true;
//             setShowPrompt(true);

//             // push a fresh guard so the URL remains at this page until user confirms
//             window.history.pushState({ __guard: true }, "", window.location.href);
//         };

//         window.addEventListener("popstate", handlePopState);
//         return () => {
//             window.removeEventListener("popstate", handlePopState);
//         };
//     }, [shouldBlock, pathname, guardedPath]);

//     // Navigate out after user confirms
//     const navigateOut = () => {
//         allowNavigationRef.current = true;
//         let clearOut = undefined

//         if (pendingActionRef.current === "back") {
//             // We inserted guard entries: go back two steps to actually exit.
//             // Use setTimeout to ensure allowNavigationRef is set before navigation.
//             clearOut = setTimeout(() => {
//                 try {
//                     // If pop was intercepted we generally need to go back 2 (guard + original)
//                     window.history.go(-3);
//                 } catch {
//                     // fallback: use referrer or homepage
//                     const ref = document.referrer;
//                     if (ref) window.location.href = ref;
//                     else window.location.href = "/";
//                 }
//             }, 1000);

//         } else if (pendingActionRef.current === "link" && pendingUrlRef.current) {
//             const url = pendingUrlRef.current;
//            clearOut = setTimeout(() => router.push(url), 1000);
//         }

//         pendingActionRef.current = null;
//         pendingUrlRef.current = null;
//         popInterceptedRef.current = false;

//         return () => clearTimeout(clearOut);
//     };

//     const handleLeaveWithoutSaving = () => {
//         setShowPrompt(false);
//         navigateOut();
//     };

//     const handleSaveAndLeave = async () => {
//         try {
//             if (onSaveDraft) await onSaveDraft();
//         } catch (err) {
//             console.error("saveDraft error:", err);
//         }
//         setShowPrompt(false);
//         navigateOut();
//     };

//     return {
//         showPrompt,
//         setShowPrompt,
//         handleSaveAndLeave,
//         handleLeaveWithoutSaving,
//     };
// };



