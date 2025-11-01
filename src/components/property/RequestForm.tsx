"use client";

import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PropertyTypes } from "@/types/property.types";
import { cn } from "@/lib/utils";
import { Spinner } from "../ui/spinner";
import CustomButton from "../CustomButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import ReCAPTCHA from "react-google-recaptcha";

// Zod validation schema
const RequestSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.email("Please enter a valid email"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[0-9+\-\s()]{7,15}$/.test(val),
      "Invalid phone number"
    ),
  message: z.string().min(5, "Message must be at least 5 characters long"),
});

type RequestFormData = z.infer<typeof RequestSchema>;

export default function RequestForm({ property }: { property: PropertyTypes }) {
  const [open, setOpen] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState("");

  const form = useForm<RequestFormData>({
    resolver: zodResolver(RequestSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: `Hello, I’m interested in the property titled "${property.title}". Please contact me with more details.`,
    },
  });

  const verifyCaptchaToken = async () => {
    setCaptchaError("");

    if (!captchaToken) {
      setCaptchaError("Please verify that you're not a robot.");
      throw new Error("Please verify that you're not a robot.")
    }
    // Send captchaToken to backend for verification
    const res = await fetch("/api/auth/reCAPTCHA", {
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

  // Handle request submission
  async function onSubmit(values: RequestFormData) {
    if (loading) return;
    setWarning("");
    setSuccess(false);
    setLoading(true);

    try {

      await verifyCaptchaToken();

      const payLoad = {
        propertyId: property.id || "",
        referenceId: property.referenceId,
        propertyTitle: property.title,
        ...values,
      };

      const res = await fetch("/api/client/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payLoad),       
      });

      const data = (await res.json()) as { success: boolean, message: string, response: "Exists" | "Success" };      

      if (!data.success) {
        if (data.response === "Exists")
          setWarning(
            "You’ve already sent a request for this property today. Please try again tomorrow."
          );

      } else {          
        if (data.response === "Success") setSuccess(true);
      }

    } catch (error) {
      console.error(error);
      setWarning("Try again later.");
    } finally {
      setLoading(false);
    }

  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <div className="sticky bottom-2 left-0 right-0">
          <CustomButton type="button" onClick={() => setOpen(true)}>
            Send Request
          </CustomButton>
        </div>
      </AlertDialogTrigger>

      <AlertDialogContent
        className={cn(
          "max-w-md w-[95%] sm:rounded-2xl rounded-t-2xl p-4 md:p-6 border-t-4 border-red-700",
          "animate-in slide-in-from-bottom-10"
        )}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-red-700">
            Send a Request
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-500 dark:text-gray-400">
            Please fill out your contact details and we’ll reach out soon.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Warning Dialog */}
        {warning && (
          <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-3 rounded-md mb-3">
            {warning}
          </div>
        )}

        {/* Success Dialog */}
        {success ? (
          <div className="text-center py-6">
            <h3 className="text-lg font-semibold text-green-600">
              Request Sent Successfully 🎉
            </h3>
            <p className="text-gray-500 mt-2">
              We’ve received your request and will contact you soon.
            </p>
            <Button
              className="mt-4 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4 text-sm"
            >
              {/* Fullname */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
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
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="+234 810 000 0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Message */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Type your message here..."
                        rows={4}
                        {...field}
                        className="min-h-[100px] max-h-[100px] overflow-auto resize-none"
                      />
                    </FormControl>
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

              <AlertDialogFooter className="mt-4">
                <div className="flex flex-col w-full gap-3">
                  {!loading ? (
                    <>
                      <AlertDialogCancel className="cursor-pointer w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700">
                        Close
                      </AlertDialogCancel>
                      <Button
                        type="submit"
                        className="cursor-pointer w-full bg-primary  text-white"
                      >
                        Send Request
                      </Button>
                    </>
                  ) : (
                    <Button variant="ghost">
                      <Spinner /> Sending...
                    </Button>
                  )}
                </div>
              </AlertDialogFooter>
            </form>
          </Form>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
