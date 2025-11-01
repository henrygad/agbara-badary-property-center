"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { Spinner } from "@/components/ui/spinner";
import { Eye, EyeOff } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import UserTypes from "@/types/user.types";


const loginSchema = z.object({
  email: z.email("Invalid email address")
    .max(100, "Email is too long")
    .min(3, "Email is required"),
  password: z.string().min(3, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export type LoginSchema = z.infer<typeof loginSchema>;


export default function Login() {

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const verifyCaptchaToken = async () => {
    setCaptchaError("");

    if (!captchaToken) {
      setCaptchaError("Please verify that you're not a robot.");
      throw new Error("Please verify that you're not a robot.")
    }
    // Send captchaToken to backend for verification
    const res = await fetch("/api/reCAPTCHA", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: captchaToken }),
    });

    const captchaData = await res.json();
    if (!captchaData?.success) {
      setCaptchaError("reCAPTCHA verification failed. Try again.");
      throw new Error("reCAPTCHA verification failed. Try again.")
    }

    return true;
  };

  const onSubmit = async (data: LoginSchema) => {
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      await verifyCaptchaToken();

      const payload = data;
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json() as { message: string, success: boolean, agent: UserTypes };

      if (!resData.success) {        
        setError(resData.message)
      } else {
        console.log(resData);
      }

      form.reset();

    } catch (error) {
      console.error(error);
      console.log(error);
      setError("Please Try again later.")

    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="flex justify-center items-center w-full px-3 py-10">
      <div className="space-y-12 bg-white shadow-md rounded-md p-8 md:p-12 md:max-w-4xl">
        {/* Header */}
        <div className="space-y-1 text-center">
          <h2 className="text-primary text-xl md:text-2xl font-semibold">
            Login
          </h2>
          <p className="text-sm">
            Access your management dashboard
          </p>
        </div>

        {/* Login form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Email *</FormLabel>
                  <FormControl>
                    <Input
                      className="text-sm"
                      type="email"
                      placeholder="agent@example.com"
                      {...field}

                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Password *</FormLabel>
                  <FormControl>
                    <div className="relative h-auto w-auto">
                      <Input
                        className="text-sm"
                        type={showPassword ? "text" : "password"}
                        placeholder="******" {...field

                        } />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 -translate-1/2 right-2  text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>

              )}
            />

            {/* Remember Me */}
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-red-400 ring-red-400"
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    Remember me
                  </FormLabel>
                </FormItem>
              )}
            />

            {/* Forgot Password */}
            <div className="text-right">
              <a href="/auth/forget-password" className="text-sm text-red-700 underline">
                Forgot password?
              </a>
            </div>

            {/* <ReCAPTCHA */}
            <div className="my-6 flex justify-center">
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_GOOGLE_reCAPTCHA_SITE_KEY!}
                onChange={(token: string | null) => setCaptchaToken(token)}
              />
            </div>

            {captchaError && (
              <p className="text-red-600 text-sm mb-3">{captchaError}</p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-red-600"
            >
              {loading ? (
                <>
                  <Spinner /> Login...
                </>
              ) : (
                "Login"
              )}
            </Button>

            <p className="mt-3 text-center w-full text-primary text-xs font-medium">{error}</p>

          </form>
        </Form>        
      </div>
    </div>
  );
};


