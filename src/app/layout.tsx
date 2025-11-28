import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import GlobalLayout from "@/components/GlobalLayout";
import { Suspense } from "react";
import CookieNotice from "@/components/CookieNotice";
import SuspenseLoader from "@/components/loaders/SuspenseLoader";
import Head from "next/head";
import TawkWidget from "@/components/TawkWidget";

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
  title: {
    default: "Agbara Badagry Property Center",
    template: "%s | Agbara Badagry Property Center",
  },
  description:
    "Find houses, land, and apartments for sale or rent along Agbara–Badagry expressway, Ogun, and Lagos. Trusted agents and verified listings.",
  keywords: [
    "Agbara",
    "Badagry",
    "Property",
    "Houses for sale",
    "Houses for rent",
    "Sell you property",
    "Rent",
    "Land",
    "Agents",
    "Real Estate",
    "Ogun",
    "Lusada",
    "Nigeria",
  ],
  openGraph: {
    type: "website",
    url: "https://agbarabadagrypropertycenter.com",
    title: "Agbara Badagry Property Center",
    description:
      "Find verified real estate listings in Agbara, Badagry, and nearby areas.",
    siteName: "Agbara Badagry Property Center",
    images: [
      {
        url: "https://agbarabadagrypropertycenter.com/images/logo_png.png",
        width: 1200,
        height: 630,
        alt: "Agbara Badagry Property Center",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Agbara Badagry Property Center",
    description:
      "Find houses, land, and apartments for sale or rent in Agbara–Badagry region.",
    images: ["https://agbarabadagrypropertycenter.com/images/logo_png.png"],
    creator: "@agbarabadagrypropertycenter",
  },
  alternates: {
    canonical: "https://agbarabadagrypropertycenter.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
  }) {


  return (
    <html lang="en">
      <Head>
        <meta name="geo.region" content="NG-OG" />
        <meta name="geo.placename" content="Agbara, Badagry" />
        <meta name="geo.position" content="6.5193;3.0511" />
        <meta name="ICBM" content="6.5193, 3.0511" />
      </Head>
      <body
        className={`${montserrat.variable} ${poppins.variable} antialiased`}
      >
        <Suspense fallback={<SuspenseLoader loading={true}></SuspenseLoader>}>
          <GlobalLayout>{children}</GlobalLayout>
          <CookieNotice />          
          <Toaster richColors closeButton position="top-right" duration={5000} />         
        </Suspense>   
        <TawkWidget />
      </body>
    </html>

  );
};

