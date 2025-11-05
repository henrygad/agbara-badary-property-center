"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {    
    LayoutDashboard,
    Plus,
    Building2,
    Users,
    FileText,
    BarChart3,
    Settings,  
    X,
    Menu,    
    Mails,    
    FileX2
    
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useLockScroll from "@/hooks/useLockScroll";
import SidebarLink from "./SidebarLink";
import Link from "next/link";
import { cn } from "@/lib/utils";

const links = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Add Property", href: "/admin/add-property", icon: Plus },
    {
        name: "Properties",
        href: "/admin/properties",
        icon: Building2,
        children: [
            { name: "Drafts", href: "/admin/properties/drafts", icon: FileText },
            { name: "Trash", href: "/admin/properties/trash", icon: FileX2 },
        ]
    },
    { name: "Agents", href: "/admin/agents", icon: Users },
    { name: "Request", href: "/admin/requests", icon: Mails },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },    
];

export default function Sidebar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    // Disable page from scrolling
    useLockScroll({ open });
    
    const active = pathname === "/admin/settings";

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
                            <div className="flex items-center justify-between h-16 border-b dark:border-gray-800 px-7">
                                <div>
                                    <h1 className="text-xl font-bold text-primary">
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
                                {links.map((v) =>
                                    <SidebarLink key={v.name} {...v} pathname={pathname} setOpen={setOpen} />
                                )}
                            </nav>

                            <div className="border-t p-4 dark:border-gray-800">
                                <Link
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                                        active
                                            ? "bg-primary text-white"
                                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                                    )}
                                    href="/admin/settings"
                                >
                                    <Settings className="h-4 w-4" /> Settings
                                </Link>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop sidebar (always visible) */}
            <aside className="hidden md:fixed md:left-0 md:top-0 md:z-40 md:flex md:h-screen md:w-64 md:flex-col md:border-r md:bg-white md:shadow-sm dark:bg-gray-900 dark:border-gray-800">
                <div className="flex items-center justify-start h-16 border-b dark:border-gray-800 px-7">
                    <h1 className="text-xl font-bold text-primary">Admin</h1>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
                    {links.map((v) =>
                        <SidebarLink key={v.name} {...v} pathname={pathname} setOpen={setOpen} />
                    )}
                </nav>

                <div className="border-t p-4 dark:border-gray-800">
                    <Link
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                            active
                                ? "bg-primary text-white"
                                : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                        )}
                        href="/admin/settings"
                    >
                        <Settings className="h-4 w-4" /> Settings
                    </Link>
                </div>

            </aside>
        </>
    );
};
