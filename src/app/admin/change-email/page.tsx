"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ReturnBack from "@/components/ReturnBack";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { showError, showSuccess } from "@/components/ui/toasts";
import { Spinner } from "@/components/ui/spinner";

// Zod validation schema
const formSchema = (currentEmail: string) =>
    z.object({
        newEmail: z.email("Please enter a valid email address.")
            .refine(
                (val) => val !== currentEmail,
                "New email cannot be the same as your current email."
            ),
    });
    
export default function ChangeEmailPage() {
    const { user } = useUserStore();

    const router = useRouter()
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const form = useForm<z.infer<ReturnType<typeof formSchema>>>({
        resolver: zodResolver(formSchema(user?.email || "")),
        defaultValues: {
            newEmail: "",
        },
    });


    const verifyEmailSendOtp = async (email: string) => {
        try {

            const payload = { email, type: "Verify Email" };

            const res = await fetch("/api/otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const resData = await res.json() as { message: string, success: boolean };

            if (!resData.success) {
                showError(resData.message);
            } else {
                router.push("/auth/verify-email?email=" + email);
                showSuccess("OTP sent.", "A one time password have been sent to your new email.")
            }

        } catch (error) {
            console.log(error);
            showError("Something went wrong. Please try again later.");
        }
    };

    const onSubmit = async (values: { newEmail: string }) => {
        setLoading(true);
        try {
            const payload = { oldEmail: user?.email, newEmail: values.newEmail };

            const res = await fetch("/api/agent/change-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const resData = await res.json() as { message: string,  success: boolean, error: boolean };

            if (!resData.success) {
                setError(resData.message);
            } else {
                showSuccess("Email updated Succesfully!")
                await verifyEmailSendOtp(payload.newEmail);
            }

        } catch (error) {
            console.error(error);
            setError("Something went wrong. Try again later.");
        } finally {
            setLoading(false);
        }

        form.reset();
    };

    return (
        <div className="w-full">
            <menu className="mb-8">
                <ReturnBack />
            </menu>
            <div className="w-full mx-auto max-w-[480px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="newEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Email Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter new email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary text-white"
                            disabled={loading}
                        >
                            {loading ? <> <Spinner /> Updating...</> : "Update Email"}
                        </Button>

                        {error && (
                            <p className="text-center text-primary text-sm mt-2">
                                {error}
                            </p>
                        )}
                    </form>
                </Form>
            </div>
        </div>
    );
}
