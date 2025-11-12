"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Headset, Menu, X } from "lucide-react";
import CompanyLogo from "./CompanyLogo";
import { AnimatePresence, motion } from "framer-motion";
import useLockScroll from "@/hooks/useLockScroll";
import { usePathname } from "next/navigation";

export default function GlobalHeader() {
  const pathname = usePathname();

  // Check current route
  const isEmailVerificationroute = pathname.startsWith("/auth/verify-email");

  return (
    <header className="p-2 sm:px-8 flex justify-between items-center border-b border-gray-200 bg-white">
      <div className="flex items-center justify-start">
        <CompanyLogo location="Header" />
      </div>
      {!isEmailVerificationroute && <>
        {/* Desktop header center nav */}
      <nav className="hidden md:flex items-center space-x-6 text-base font-medium">
        <Link
          className="hover:text-primary"
          href={{ pathname: "/properties", query: { tab: "Sale" } }}
        >
          BUY
        </Link>
        <Link
          className="hover:text-primary"
          href="/auth/register"
        >
          SELL
        </Link>
        <Link
          className="hover:text-primary"
          href={{ pathname: "/properties", query: { tab: "Rent" } }}
        >
          RENT
        </Link>
      </nav>

      {/* Desktop header right end nav */}
      <nav className="hidden md:flex gap-4 items-center text-sm md:text-base font-medium pr-2">
        <Link
          className="flex hover:text-primary"
          href="/auth/login"
        >
          Login
        </Link>
        <Link
          className="flex bg-primary text-white px-4 py-1.5 rounded-md shadow hover:bg-red-600"
          href="/auth/register"
        >
          Register
        </Link>
        <Link
          href="/contact"
          className="flex items-center space-x-1 hover:text-primary"
        >
          <Headset size={20} className="text-green-900" />
        </Link>
      </nav>
      {/* Mobile header drop down nav */}
        <MobileDropdown />
      </>}
    </header>
  );
};


const links = [
  { name: "BUY", href: "/properties?tab=Sale" },
  { name: "SELL", href: "/auth/register" },
  { name: "RENT", href: "/properties?tab=Rent" },
  { name: "Login", href: "/auth/login" },
  { name: "Register", href: "/auth/register" },
  { name: "Contact", href: "/contact" },
];


function MobileDropdown() {
  const [open, setOpen] = useState(false);

  useLockScroll({ open });

  return (
    <div className="relative md:hidden z-50">
      {/* Hamburger Button */}
      <button
        onClick={() => setOpen(true)}
        className="p-2 text-red-700 rounded-md focus:outline-none"
      >
        <Menu size={24} />
      </button>

      {/* Overlay + Menu */}
      <AnimatePresence>
        {open && (
          <>
            {/* Transparent black background */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Dropdown menu */}
            <motion.div
              key="menu"
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 left-0 right-0 bg-red-700 text-white shadow-lg rounded-b-2xl p-6 flex flex-col space-y-3"
            >
              {/* Close button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setOpen(false)}
                  className="text-white hover:bg-white/10 rounded-full p-2 transition-colors"
                >
                  <X size={26} />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-2 mt-2">
                {links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 rounded-lg text-lg font-medium hover:bg-white/10 transition-all"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}


