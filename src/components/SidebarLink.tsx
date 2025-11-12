import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LucideProps } from "lucide-react";
import Link from "next/link";
import { ForwardRefExoticComponent, RefAttributes, useState } from "react";

type Link = {
    href: string,
    name: string,
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>,
}

interface Props extends Link {
    pathname: string
    setOpen: (open: boolean) => void
    children?: Link[]
}

export default function SidebarLink({ href, name, setOpen, pathname, icon: Icon, children }: Props) {
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const toggleMenu = (menu: string) => {
        console.log("first")
        setOpenMenu(openMenu === menu ? null : menu);
    };
    const active = pathname === href    

    if (children?.length) {
        return <div>
            <button
                onClick={() => toggleMenu("properties")}
                className="flex items-end gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            >
                <span className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    {name}
                </span>
                <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${openMenu === "properties" ? "rotate-180" : ""}`}
                />
            </button>
            <AnimatePresence>
                {openMenu === "properties" &&
                    <motion.nav
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-8 mt-2 space-y-2"
                    >
                        {children.map(lk => {
                            const ChildIcon = lk.icon;
                            const active = pathname === lk.href;
                            return <Link
                                key={lk.href}
                                href={lk.href}
                                onClick={() => {
                                    setOpen(false);
                                }}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                                    active
                                        ? "bg-primary text-white"
                                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                                )}
                            >
                                <ChildIcon className="h-5 w-5" />
                                {lk.name}
                            </Link>
                        })}
                    </motion.nav>
                }
            </AnimatePresence>
            {/* <nav className="ml-4 my-2 p-2 space-y-2 shadow-indigo-50 border-l border-gray-100">
                {children.map(lk => {
                    const ChildIcon = lk.icon;
                    const active = pathname === lk.href;
                    return <Link
                        key={lk.href}
                        href={lk.href}
                        onClick={() => {
                            setOpen(false);
                        }}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                            active
                                ? "bg-primary text-white"
                                : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                        )}
                    >
                        <ChildIcon className="h-5 w-5" />
                        {lk.name}
                    </Link>
                })}
            </nav> */}
        </div>
    }
    return (
        <Link
            href={href}
            onClick={() => setOpen(false)}
            className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                active
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            )}
        >
            <Icon className="h-5 w-5" />
            {name}
        </Link>
    );
}