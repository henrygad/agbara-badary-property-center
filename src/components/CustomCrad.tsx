import { ReactNode } from "react";

export default function CustomCard({ children }: { children: ReactNode }) {
    return <div className=" text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 border border-gray-50 rounded-2xl px-2 py-4 shadow-sm">{children}</div>;
}