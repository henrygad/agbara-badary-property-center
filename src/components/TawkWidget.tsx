"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

export default function TawkWidget() {
  const pathname = usePathname();

  const hide = pathname.startsWith("/admin") ||
    pathname.startsWith("/agent") ||
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register");

  if (hide) return null;

  return (
    <Script
      id="tawkto-chat"
      strategy="afterInteractive"
      type="text/javascript">
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
  );
}
