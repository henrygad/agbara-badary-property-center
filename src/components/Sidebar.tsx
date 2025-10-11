"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    PlusCircle,
    List,
    Users,
    FileText,
    BarChart3,
    Settings,
    LogOut,
    X,
    Menu,    
    Mails,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useLockScroll from "@/hooks/useLockScroll";
import SidebarLink from "./SidebarLink";

const links = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Add Property", href: "/admin/add-property", icon: PlusCircle },
    { name: "Properties", href: "/admin/properties", icon: List },
    { name: "Agents", href: "/admin/agents", icon: Users },
    { name: "Request", href: "/admin/requests", icon: Mails },
    { name: "Drafts", href: "/admin/drafts", icon: FileText },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    // Disable page from scrolling
        useLockScroll({ open });

    return (
        <>
            {/* Mobile toggle button */}
            <button
                onClick={() => setOpen((o) => !o)}
                className="fixed left-4 top-4 z-50 rounded-lg bg-primary p-1.5 md:hidden cursor-pointer text-white"
            >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Animated sidebar */}
            <AnimatePresence>
                {open && (
                    <>
                        {/* Overlay (for mobile) */}
                        <motion.div
                            className="fixed inset-0 z-40 bg-black/40 md:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 120, damping: 20 }}
                            className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r shadow-xl md:translate-x-0 bg-inherit dark:bg-inherit"
                        >
                            <div className="flex items-center justify-between h-16 border-b dark:border-gray-800 px-4">
                                <div>
                                    <h1 className="text-xl font-bold">
                                        Admin
                                    </h1>
                                </div>
                                <div>
                                    <button
                                        onClick={() => setOpen((o) => !o)}
                                        className="rounded-lg bg-primary p-1.5 text-white md:hidden cursor-pointer"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
                                {links.map((v) => {
                                    const active = pathname === v.href;
                                    return <SidebarLink key={v.name} {...v} active={active} setOpen={setOpen} />;
                                })}
                            </nav>

                            <div className="border-t p-4 dark:border-gray-800">
                                <button
                                    className="flex w-full items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-all dark:text-gray-300"
                                    onClick={() => console.log("logout clicked")}
                                >
                                    <LogOut className="h-4 w-4" /> Logout
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop sidebar (always visible) */}
            <aside className="hidden md:fixed md:left-0 md:top-0 md:z-40 md:flex md:h-screen md:w-64 md:flex-col md:border-r md:bg-white md:shadow-sm dark:bg-gray-900 dark:border-gray-800">
                <div className="flex items-center justify-start h-16 border-b dark:border-gray-800 px-4">
                    <h1 className="text-xl font-bold">Admin</h1>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
                    {links.map((v) => {
                        const active = pathname === v.href;                        
                        return (
                            <SidebarLink key={v.name} {...v} active={active} setOpen={setOpen} />                            
                        );
                    })}
                </nav>

                <div className="border-t p-4 dark:border-gray-800">
                    <button
                        className="flex w-full items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-all dark:text-gray-300"
                        onClick={() => console.log("logout clicked")}
                    >
                        <LogOut className="h-4 w-4" /> Logout
                    </button>
                </div>

            </aside>
        </>
    );
};
