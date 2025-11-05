"use client";
import GlobalHeader from "./GlobalHeader";
import GlobalFooter from "./GlobalFooter";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useClientStore } from "@/store/useClientStore";
import { getPropertiesDb } from "@/lib/firebase/property_service";

export default function GlobalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const { setLoading, setProperties } = useClientStore();

  // Use pathname to check current route
  const isAdminOrAgentRoute = pathname.startsWith("/admin") || pathname.startsWith("/agent");
  const isEmailVerificationroute = pathname.startsWith("/auth/verify-email");


  useEffect(() => {
    async function client() {
      try {
        const res = await fetch("/api/client/");
        const data = (await res.json()) as { success: boolean, message: string, response: "Exists" | "Success" };

        if (data) {
          setLoading(true, false)

          const res = await getPropertiesDb();
          if (res) {
            setProperties(res);
          }
          setLoading(false, false)
        }

      } catch (error) {
        console.error(error);
      }

    }
    client()
  }, [setProperties,setLoading]);

  return (
    <>
      {isAdminOrAgentRoute ? (
        <>{children}</>
      ) : (
        <div className="bg-gray-50">
          <div className="max-w-screen-2xl mx-auto break-words text-wrap">
              {!isEmailVerificationroute && <GlobalHeader />}
            <main className=" sm:p-8">{children}</main>
              {!isEmailVerificationroute && <GlobalFooter />}
          </div>
        </div>
      )}
    </>
  );
}
