import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import GlobalLayout from "@/components/GlobalLayout";
import { Suspense } from "react";
import CookieNotice from "@/components/CookieNotice";
import SuspenseLoader from "@/components/loaders/SuspenseLoader";

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
        </Suspense>

      </body>
    </html>
  );
}

