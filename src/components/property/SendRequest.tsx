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

// Zod validation schema
const RequestSchema = z.object({
    name: z.string().min(2, "Full name is required"),
    email: z.email("Please enter a valid email"),
    phone: z
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .regex(/^[0-9+]+$/, "Only numbers and + allowed"),
    message: z.string().optional(),
});

type RequestFormData = z.infer<typeof RequestSchema>;

export default function SendRequest({ property }: { property: PropertyTypes }) {

    const [open, setOpen] = useState(false);
    const [warning, setWarning] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<RequestFormData>({
        resolver: zodResolver(RequestSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            message: `Hello, I’m interested in the property titled "${property.title}". Please contact me with more details.`,
        },
    });

    // Handle request submission
    async function onSubmit(values: RequestFormData) {
        if (loading) return;
        setWarning("");
        setSuccess(false);

        setLoading(true);

        const payLoad = {
            propertyId: property.id || "",
            referenceId: property.referenceId,
            propertyTitle: property.title,
            ...values
        };

        try {
            const res = await fetch("/api/client/request", {
                method: "POST",
                body: JSON.stringify(payLoad),
            });

            const data = await res.json() as { response: "Exists" | "Success" }
            setLoading(false);

            if (data.response === "Exists") setWarning("You’ve already sent a request for this property today. Please try again tomorrow.");
            if (data.response === "Success") setSuccess(true);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <div className="sticky bottom-4 left-0 right-0">
                    <Button
                        onClick={() => setOpen(true)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold cursor-pointer"
                    >
                        Send Request
                    </Button>
                </div>
            </AlertDialogTrigger>

            <AlertDialogContent
                className={cn(
                    "max-w-md w-[95%] sm:rounded-2xl rounded-t-2xl p-6 border-t-4 border-red-700",
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

                {/* ⚠️ Warning Dialog */}
                {warning && (
                    <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-3 rounded-md mb-3">
                        {warning}
                    </div>
                )}

                {/* ✅ Success Dialog */}
                {success ? (
                    <div className="text-center py-6">
                        <h3 className="text-lg font-semibold text-green-600">Request Sent Successfully 🎉</h3>
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
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 mt-4">
                        <div>
                            <Input
                                placeholder="Full Name"
                                {...form.register("name")}
                                className={cn(
                                    "border-gray-300 focus:border-blue-500",
                                    form.formState.errors.name && "border-red-500"
                                )}
                            />
                            {form.formState.errors.name && (
                                <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <Input
                                placeholder="Email Address"
                                {...form.register("email")}
                                className={cn(
                                    "border-gray-300 focus:border-blue-500",
                                    form.formState.errors.email && "border-red-500"
                                )}
                            />
                            {form.formState.errors.email && (
                                <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <Input
                                placeholder="Phone Number"
                                {...form.register("phone")}
                                className={cn(
                                    "border-gray-300 focus:border-blue-500",
                                    form.formState.errors.phone && "border-red-500"
                                )}
                            />
                            {form.formState.errors.phone && (
                                <p className="text-red-500 text-sm mt-1">{form.formState.errors.phone.message}</p>
                            )}
                        </div>

                        <div>
                            <Textarea
                                rows={10}
                                {...form.register("message")}
                                className="border-gray-300 focus:border-blue-500 resize-none h-30"
                            />
                        </div>

                        <AlertDialogFooter className="mt-4">
                            <div className="flex flex-col w-full gap-3">
                                {!loading ?
                                    <>
                                        <AlertDialogCancel className="cursor-pointer w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700">
                                            Cancel
                                        </AlertDialogCancel>
                                        <Button
                                            type="submit"
                                            className="cursor-pointer w-full bg-primary  text-white"
                                        >
                                            Send Request
                                        </Button>
                                    </> :
                                    <Button
                                        variant="ghost"
                                    >
                                        <Spinner /> Sending...
                                    </Button>


                                }
                            </div>
                        </AlertDialogFooter>
                    </form>
                )}
            </AlertDialogContent>

        </AlertDialog>
    );

};
