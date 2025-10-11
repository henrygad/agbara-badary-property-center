import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react";
import Link from "next/link";
import { ForwardRefExoticComponent, RefAttributes } from "react";

type Props = {
    href: string,
    active: boolean,
    name: string,
    setOpen: (open: boolean) => void
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
}

export default function SidebarLink({href, active, name, setOpen, icon: Icon }: Props) {
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