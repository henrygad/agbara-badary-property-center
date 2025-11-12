"use client";
import GlobalHeader from "./GlobalHeader";
import GlobalFooter from "./GlobalFooter";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useClientStore } from "@/store/useClientStore";
import { getPropertiesDb } from "@/lib/firebase/property_service";
import Script from "next/script";

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
          <div className="max-w-screen-2xl min-h-screen mx-auto break-words text-wrap">
              {!isEmailVerificationroute && <GlobalHeader />}
            <main className=" sm:p-8">{children}</main>
              {!isEmailVerificationroute && <GlobalFooter />}
            </div>
            
            {/* Tawk.to Chat Widget */}
            <Script id="tawkto-chat" strategy="afterInteractive" type="text/javascript">
              {`
            var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
            (function() {
              var s1 = document.createElement("script"),
              s0 = document.getElementsByTagName("script")[0];
              s1.async = true;
              s1.src = 'https://embed.tawk.to/${process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID}/1j9mfrvtn';              
              s1.charset = 'UTF-8';
              s1.setAttribute('crossorigin', '*');
              s0.parentNode.insertBefore(s1, s0);
            })();
          `}
            </Script>
        </div>
      )}
    </>
  );
}
