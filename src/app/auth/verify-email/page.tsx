"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { motion } from "framer-motion";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useRouter, useSearchParams } from "next/navigation";
import { showError, showSuccess } from "@/components/ui/toasts";
import { maskEmail } from "@/utils";
import z from "zod";

const otpSchema = z.object({
  code: z.string().min(6, "Enter all 6 digits"),
  email: z.email("Invalid email address")
    .max(100, "Email is too long"),
});

type OtpSchema = z.infer<typeof otpSchema>;

export default function VerifyEmail() {
  const query = useSearchParams();
  const router = useRouter();

  const form = useForm<OtpSchema>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: "", email: "" },
  });

  const [resendTimer, setResendTimer] = useState(60);
  const [otpError, setOtpError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Countdown for resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Auto fill email
  useEffect(() => {
    const emailParam = query.get("email");
    if (emailParam) {
      form.setValue("email", emailParam);
    }
  }, [query, form])

  // Called when 6 digits complete
  const handleAutoSubmit = async (otp: string) => {
    if (otp.length < 6) return;
   
    const email = form.getValues("email");
    if (!email) return;

    if (isLoading) return;
    setOtpError("");
    setIsLoading(true);

    try {

      const payload = { otp, email };

      const res = await fetch("/api/otp/verify/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json() as { message: string, success: boolean };

      if (!resData.success) {
        console.log(resData);
        setOtpError(resData.message);
      } else {
        console.log(resData);
        router.push("/auth/verify-email/success");
      }

      form.reset();

    } catch (error) {
      console.error(error);
      console.log(error);
      setOtpError("Please Try again later.")

    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const resendCode = async () => {
    
    const email = form.getValues("email");

    if (!email || isLoading || resendTimer > 0) return;

    setResendTimer(60);
    setOtpError("");
    try {

      const payload = { email, type: "Verify Email" };

      const res = await fetch("/api/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json() as { message: string, success: boolean };

      if (!resData.success) {
        console.log(resData);
        showError(resData.message);
      } else {
        console.log(resData);
        showSuccess("New OTP sent!")
      }


    } catch (error) {
      console.log(error);
      showError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center w-full px-3 py-10">
      <div className="space-y-8 bg-white shadow-md rounded-md p-8 md:p-12 md:max-w-4xl">
        {/* Header */}
        <div className="space-y-1 text-center">
          <h2 className="text-primary text-xl md:text-2xl font-semibold">
            Verify Your Email
          </h2>
          <p className="text-gray-600 text-sm">
            Enter the 6-digit verification code sent to your email: {maskEmail(form.getValues("email"))}
          </p>
        </div>

        {/* OTP Input */}
        <Form {...form}>
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-center mb-6 relative">

                  {/* Loading spinner */}
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full"></div>
                    </motion.div>
                  ) : (
                    <InputOTP
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        if (value.length === 6) handleAutoSubmit(value);
                      }}
                    >
                      <InputOTPGroup>
                        {[...Array(6)].map((_, i) => (
                          <InputOTPSlot
                            key={i}
                            index={i}
                            className="border-gray-300 focus:border-red-600 focus:ring-red-600 text-xl font-semibold"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  )
                  }

                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>

        {/* Footer */}
        <div className="flex flex-col gap-2 justify-center items-center">
          {/* Error Message */}
          {otpError && (
            <p className="text-red-600 text-sm mb-3 font-medium">{otpError}</p>
          )}

          {/* Resend OTP */}
          <div className="mb-4 spac-y-2 text-center">
            <p className="text-gray-600 text-xs">{"Didn't receive a code?"}</p>
            <Button
              type="button"
              variant="link"
              className="text-red-700 underline"
              onClick={resendCode}
              disabled={resendTimer > 0 || isLoading}
            >
              {resendTimer > 0
                ? `Resend Code in ${resendTimer}s`
                : "Resend Code"}
            </Button>
          </div>

          {/* Expiry Notice */}
          <div className="border-l-2 rounded-2xl border-primary shadow-sm p-2 mt-6">
            <p className="text-sm text-gray-500">
              {"For your security, The verification code sent to your email will expire in 15 minutes. If you don't receive an email, please check your spam folder."}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
