"use client";

import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 text-center px-6 py-12 min-h-[80vh]">
      {/* 404 Illustration */}
      <div className="mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-28 h-28 text-red-700 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 9.75L14.25 14.25M14.25 9.75L9.75 14.25M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0Z"
          />
        </svg>
      </div>

      {/* Heading */}
      <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">
        Page Not Found
      </h2>

      {/* Subtext */}
      <p className="text-gray-600 mb-8 max-w- text-sm">
        Oops! The page you’re looking for doesn’t exist or may have been moved.
      </p>

      {/* Return Button */}
      <Button
        onClick={() => router.push("/auth/login")}
        className="bg-primary hover:bg-red-600 text-white flex items-center gap-2"
      >
        <MoveLeft size={18} />
        Return Back
      </Button>
    </div>
  );
}
