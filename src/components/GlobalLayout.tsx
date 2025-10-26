"use client";
import GlobalHeader from "./GlobalHeader";
import GlobalFooter from "./GlobalFooter";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function GlobalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Use pathname to check current route
  const isAdminOrAgentRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/agent");

  return (
    <>
      {isAdminOrAgentRoute ? (
        <>{children}</>
      ) : (
        <div className="bg-gray-50">
          <div className="max-w-screen-2xl mx-auto break-words text-wrap">
            <GlobalHeader />
            <main className=" sm:p-8">{children}</main>
            <GlobalFooter />
          </div>
        </div>
      )}
    </>
  );
}
