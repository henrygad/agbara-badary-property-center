"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function VerifySuccess() {

  return (
    <div className="flex justify-center items-center w-full px-3 py-10">
      <div className="space-y-4 bg-white shadow-md rounded-md p-8 md:p-12 md:max-w-4xl">
        <div className="flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CheckCircle2 className="w-14 h-14 md:w-20 md:h-20 text-green-600 mb-4" />
          </motion.div>
          <h3 className="text-xl md:text-3xl font-semibold text-gray-800 mb-2">
            Password Reset Successfully!
          </h3>
          <p className="text-gray-600 mb-6 text-sm">
            Your password has been successfully changed. You can now Login with your new password.
          </p>
          <Button
            className="bg-primary hover:bg-red-600 text-white px-6"
          >
            <Link href="/auth/login" >
              Login
            </Link>
          </Button>

        </div>

      </div>
    </div>
  );
}
