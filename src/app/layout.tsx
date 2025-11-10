import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import GlobalLayout from "@/components/GlobalLayout";
import { Suspense } from "react";
import CookieNotice from "@/components/CookieNotice";
import SuspenseLoader from "@/components/loaders/SuspenseLoader";
import Script from "next/script";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Agbara Badagry Property Center",
  description: "Property listing hub in Agbara Badagry Property Center",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
  }) {


  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${poppins.variable} antialiased`}
      >
        <Suspense fallback={<SuspenseLoader loading={true}></SuspenseLoader>}>
          <GlobalLayout>{children}</GlobalLayout>
          <CookieNotice />          
          <Toaster richColors closeButton position="top-right" duration={5000} />
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
        </Suspense>            
      </body>
    </html>
  );
}

