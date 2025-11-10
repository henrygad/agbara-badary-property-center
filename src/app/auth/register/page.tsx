"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {  z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";
import { Eye, EyeOff } from "lucide-react";
import { RegisterTypes } from "@/types/auth.types";
import { useRouter } from "next/navigation";
import UserTypes from "@/types/user.types";
import { useUserStore } from "@/store/useUserStore";
import { LoginSchema } from "../login/page";

const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name is required")
      .max(30, "First name is too long"),
    lastName: z
      .string()
      .min(2, "Last name is required")
      .max(30, "Last name is too long"),
    email: z.email("Invalid email address")
      .max(100, "Email is too long")
      .min(3, "Email is required"),
    phoneCode: z
      .string()
      .min(1, "Country code is required")
      .max(5, "Invalid country code format"),
    phone: z
      .string()
      .min(7, "Phone number is required")
      .refine(
        (val) => /^[0-9+\-\s()]{7,15}$/.test(val),
        "Invalid phone number"
      ),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type SignupSchema = z.infer<typeof signupSchema>;

export default function Register() {
  const router = useRouter();

  const { setUser } = useUserStore();

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneCode: "+234",
      phone: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
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

  const onSubmitLogin = async (data: LoginSchema) => {

    try {

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
        setUser(resData.agent);
      }

    } catch (error) {
      console.error(error);
    }

  };

  const onSubmit = async (data: SignupSchema) => {
    if (loading) return;
    setLoading(true);
    setError("")

    try {

      await verifyCaptchaToken();

      const payload: RegisterTypes = {
        ...data, accountType: "Agent", accountStatus: "Pending"
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json() as { message: string, success: boolean };

      if (!resData.success) {        
        setError(resData.message)
      } else {

        await onSubmitLogin({ email: payload.email, password: payload.password, rememberMe: false });

        router.push("/auth/verify-email?email=" + data.email);
      }


    } catch (error) {
      console.error(error);     
      setError("Please Try again later.")
      form.reset();
      setLoading(false);
    } 


  };

  
  return (
    <div className="flex justify-center items-center w-full px-3 py-10">
      <div className="space-y-12 bg-white shadow-md rounded-md px-3 py-8 md:p-12 md:max-w-4xl">

        {/* Header */}
        <div className="space-y-1 text-center">
          <h2 className="text-primary text-xl md:text-2xl font-semibold">
            Create Agent Account
          </h2>
          <p className="text-sm">List your property with use today</p>
        </div>

        {/* Register Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">

            {/* First Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">First Name *</FormLabel>
                  <FormControl>
                    <Input className="text-sm" placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Last Name *</FormLabel>
                  <FormControl>
                    <Input className="text-sm" placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Email *</FormLabel>
                  <FormControl>
                    <Input className="text-sm"
                      type="email"
                      placeholder="agent@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone + Code */}
            <div className="grid grid-cols-3 gap-3">
              <FormField
                control={form.control}
                name="phoneCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Code *</FormLabel>
                    <FormControl>
                      <Input className="text-sm" placeholder="+234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="text-sm">Phone *</FormLabel>
                    <FormControl>
                      <Input className="text-sm" placeholder="810 000 0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Password *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="text-sm"
                        type={showPassword ? "text" : "password"}
                        placeholder="******" {...field}
                      />
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

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Confirm Password *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="text-sm"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="******"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute top-1/2 -translate-1/2 right-2  text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Terms Agreement */}
            <FormField
              control={form.control}
              name="agreeToTerms"
              render={({ field }) => (
                <FormItem className="mt-8 flex items-start justify-center gap-2 max-w-[320px] sm:max-w-full">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-red-400 ring-red-400"
                    />
                  </FormControl>
                  <FormLabel>
                    <p className="text-sm font-normal block">
                      I agree to the <a href="/terms" className="text-red-700 underline">Terms and Conditions</a>
                    </p>
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  <Spinner /> Registring...
                </>
              ) : (
                "Register"
              )}
            </Button>

            <p className="mt-3 text-center w-full text-primary text-xs font-medium">{error}</p>

          </form>
        </Form>

        {/* Footer */}
        <div className="flex gap-2 justify-center items-center">
          <p className="text-sm">Already have an account?</p>
          <Button
            variant="ghost"
            className="test-sm text-primary font-semibold"
          >
            <Link href="/auth/login">Login</Link>
          </Button>
        </div>

      </div>
    </div>
  );
};
