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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

const forgetPasswordSchema = z.object({
    email: z.email("Invalid email address")
        .max(100, "Email is too long")
        .min(3, "Email is required"),
});

export type ForgetPasswordSchema = z.infer<typeof forgetPasswordSchema>;

export default function ForgetPassword() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const form = useForm<ForgetPasswordSchema>({
        resolver: zodResolver(forgetPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    // Resend OTP
    const onSubmit = async (data: ForgetPasswordSchema) => {

        if (loading) return;
        setLoading(true);
        setError("");

        try {

            const payload = { ...data, type: "Reset Password" };

            const res = await fetch("/api/otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const resData = await res.json() as { message: string, success: boolean };

            if (!resData.success) {
                console.log(resData);
                setError(resData.message);
            } else {
                console.log(resData);
                router.push("/auth/forget-password/verify-account?email=" + data.email);
            }

        } catch (error) {
            console.log(error);
            setError("Something went wrong. Please try again later.");
        }
    };


    return (
        <div className="flex justify-center items-center w-full px-3 py-10">
            <div className="space-y-8 bg-white shadow-md rounded-md p-8 md:p-12 md:max-w-4xl">
                {/* Header */}
                <div className="space-y-1 text-center">
                    <h2 className="text-primary text-xl md:text-2xl font-semibold">
                        Reset Password
                    </h2>
                    <p className="text-gray-600 text-sm">
                        {"Enter your email and we'll send you OTP and reset link"}
                    </p>
                </div>

                {/* Verify account email Form */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm">Enter the email for the account *</FormLabel>
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

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-red-600"
                        >
                            {loading ? (
                                <>
                                    <Spinner /> Searching...
                                </>
                            ) : (
                                "Search account"
                            )}
                        </Button>
                    </form>
                </Form>

                {/* Footer */}
                <div className="flex flex-col gap-2 justify-center items-center">
                    {/* Error Message */}
                    {error && (
                        <p className="text-red-600 text-sm mb-3 font-medium">{error}</p>
                    )}

                    {/* Login buttonn */}
                    <div className="flex gap-2 justify-center items-center flex-wrap">
                        <p className="text-sm">Remember your password?</p>
                        <Button
                            variant="ghost"
                            className="test-sm text-primary font-semibold"
                        >
                            <Link href="/auth/agent-login" className="text-sm">Return to Login</Link>
                        </Button>
                    </div>

                    {/* Expiry Notice */}
                    <div className="border-l-2 rounded-2xl border-primary shadow-sm p-2 mt-6">
                        <p className="text-sm text-gray-500">
                            {"For your security, The resent password link sent to your email will expire in 15 minutes. If you don't receive an email, please check your spam folder."}
                        </p>
                    </div>
                </div>

            </div>
        </div >
    );
}
