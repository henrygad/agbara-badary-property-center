import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react";
import Link from "next/link";
import { ForwardRefExoticComponent, RefAttributes} from "react";

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
    const active = pathname === href
    const childActive = children?.some((v) => v.href === pathname);

    if (children?.length && (active || childActive)) {
        return <div>
            <Link
                key={href}
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
            <nav className="ml-4 my-2 p-2 space-y-2 shadow-indigo-50 border-l border-gray-100">
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
            </nav>
        </div>
    }
    return (
        <Link
            key={href}
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