"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Spinner } from "./ui/spinner";
import { showError } from "./ui/toasts";
import ReCAPTCHA from "react-google-recaptcha";


const contactSchema = z.object({
    name: z.string().min(2, "Full name is required"),
    email: z.email("Invalid email address"),
    phone: z
        .string()
        .optional()
        .refine(
            (val) => !val || /^[0-9+\-\s()]{7,15}$/.test(val),
            "Invalid phone number"
        ),
    subject: z.string().min(2, "Please select a subject"),
    message: z.string().min(5, "Message must be at least 5 characters long"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactForm() {
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [captchaError, setCaptchaError] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
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

    const onSubmit = async (data: ContactFormValues) => {
        setLoading(true);
        try {

            await verifyCaptchaToken();
            
            const payload = data;
            const res = await fetch("/api/client/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await res.json();
            if (result.success) {
                setOpenDialog(true);
                form.reset();                            
            } else {
                showError("Failed to send message. Please try again later.")
            }
        } catch (error) {
            console.error(error);
            console.log(error);
            showError("Something went wrong. Please try again")
        } finally {
            setLoading(false);

        }
    };

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                                    <Input placeholder="you@example.com" type="email" {...field} />
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

                    {/* Subject (Select Dropdown) */}
                    <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Subject *</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Inquiry Type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                                        <SelectItem value="Property Listing">Property Listing</SelectItem>
                                        <SelectItem value="Booking a Viewing">Booking a Viewing</SelectItem>                                        
                                        <SelectItem value="Technical Issue">Technical Issue</SelectItem>
                                        <SelectItem value="Legal Support">Legal Support</SelectItem>
                                        <SelectItem value="Partnership or Advertising">
                                            Partnership / Advertising
                                        </SelectItem>
                                        <SelectItem value="Feedback or Complaint">
                                            Feedback / Complaint
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
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
                                        className="min-h-[200px] resize-none"
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

                    {/* Submit button */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-red-600"
                    >
                        {loading ? <><Spinner /> Submit...</> : "Submit"}
                    </Button>
                </form>
            </Form>

            {/*Success Dialog */}
            <Dialog open={openDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Message Sent Successfully!</DialogTitle>
                    </DialogHeader>
                    <p className="text-gray-600">
                        Thank you for reaching out. Our team will get back to you shortly.
                    </p>
                    <DialogFooter>
                        <Button
                            type="button"
                            className="bg-red-700 hover:bg-red-800"
                            onClick={() => setOpenDialog(false)}
                        >
                            OK
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

