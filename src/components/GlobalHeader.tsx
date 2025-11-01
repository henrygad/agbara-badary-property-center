"use client";

import React from "react";
import Link from "next/link";
import { Headset } from "lucide-react";
import CompanyLogo from "./CompanyLogo";
import { usePathname } from "next/navigation";

export default function GlobalHeader() {
  const pathname = usePathname();
  const isPropertiesPage = pathname.startsWith("/properties");
  const isAuthRoutes = pathname.startsWith("/auth");

  return (
    <header className="px-2 pt-1 sm:px-8 flex justify-between items-center border-b border-gray-200 bg-white">
      <div className="flex items-center justify-start">
        <CompanyLogo location="Header" />
      </div>
      {!isPropertiesPage && (
        <nav className="hidden md:flex items-center space-x-6 text-base font-medium">
          <Link
            className="hover:text-primary"
            href={{ pathname: "/properties", query: { tab: "Sale" } }}
          >
            Buy
          </Link>
          <Link
            className="hover:text-primary"
            href={{ pathname: "/properties", query: { tab: "Rent" } }}
          >
            Rent
          </Link>
          <Link
            className="hover:text-primary"
            href={{ pathname: "/properties", query: { tab: "Short-let" } }}
          >
            Short-let
          </Link>
          <Link
            className="hover:text-primary"
            href={{ pathname: "/properties", query: { tab: "Commercial" } }}
          >
            Commercial
          </Link>
        </nav>
      )}
      <div className="flex gap-4 items-center text-sm md:text-base font-medium pr-2">
        {!isAuthRoutes && (
          <>
            <Link
              className="hidden md:flex hover:text-primary"
              href="/auth/agent-login"
            >
              Login
            </Link>
            <Link
              className="hidden md:flex bg-primary text-white px-4 py-2 rounded-md shadow hover:bg-red-600"
              href="/auth/agent-register"
            >
              Register
            </Link>
            <Link
              className="md:hidden flex bg-primary text-white px-4 py-1.5 rounded-md shadow hover:bg-red-600"
              href="/auth/agent-login"
            >
              Login
            </Link>
          </>
        )}
        <Link
          href="/contact"
          className="flex items-center space-x-1 hover:text-primary"
        >
          <Headset size={20} className="text-green-900" />
        </Link>
      </div>
    </header>
  );
}
