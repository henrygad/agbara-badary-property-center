"use client";

import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useModal } from "@/hooks/useModal";

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

  const [warning, setWarning] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState("");

  const { open, handleModal } = useModal();

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
    <>
      <div className="sticky bottom-2 left-0 right-0">
        <CustomButton type="button" onClick={() => handleModal(true)}>
          Send Request
        </CustomButton>
      </div>

      {open &&
        <div
          className={cn("fixed top-1/2 left-1/2 -translate-1/2 z-40 max-w-[320px] sm:max-w-[480px] bg-white shadow-2xl shadow-accent-foreground rounded-xl p-5 border-t-4 border-primary")}
        >
          <div className="animate-in slide-in-from-bottom-10 min-w-[280px] max-h-full overflow-hidden">
            <div>
              <h3 className="text-xl font-bold text-red-700 text-center">
                Send a Request
              </h3>
              <p className="text-gray-500 text-sm dark:text-gray-400 text-center">
                Please fill out your contact details and we’ll reach out soon.
              </p>
            </div>

            {/* Warning Dialog */}
            {warning && (
              <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-3 rounded-md mb-3">
                {warning}
              </div>
            )}

            {/* Success Dialog */}
            {success ? (
              <div className="text-center py-4">
                <h3 className="text-lg font-semibold text-green-600">
                  Request Sent Successfully 🎉
                </h3>
                <p className="text-gray-500 mt-2">
                  We’ve received your request and will contact you soon.
                </p>
                <Button
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleModal(false)}
                >
                  Close
                </Button>
              </div>
            ) : (

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-3 mt-4 text-sm w-full h-full"
                >
                    <ScrollArea className="max-h-[70%] overflow-y-auto">
                      <div className="space-y-3">
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
                                  className="min-h-[90px] max-h-[90px] text-sm overflow-auto resize-none"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* <ReCAPTCHA */}
                        <div className="relative flex justify-end min-h-10">
                          <div className="absolute">
                            <ReCAPTCHA
                              sitekey={process.env.NEXT_PUBLIC_GOOGLE_reCAPTCHA_SITE_KEY!}
                              onChange={(token: string | null) => setCaptchaToken(token)}
                            />
                          </div>
                        </div>

                        {captchaError && (
                          <p className="text-primary text-sm mb-3">{captchaError}</p>
                        )}
                      </div>
                      <ScrollBar />
                    </ScrollArea>

                    {/* Footer */}
                  <div className="mt-4">
                    <div className="flex flex-col w-full gap-3">
                      {!loading ? (
                        <>
                          <Button
                            type="button"
                            variant="outline"
                            className="cursor-pointer w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
                              onClick={() => handleModal(false)}

                          >
                            Close
                          </Button>
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
                  </div>

                </form>
              </Form>
            )}
          </div>
        </div>
      }
    </>
  );
};

