import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function ImageLoader({ className }: { className?: string }) {
    return <div
        className={cn("flex items-center justify-center bg-gray-100 animate-pulse", className)}
    >
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
    </div>
};

