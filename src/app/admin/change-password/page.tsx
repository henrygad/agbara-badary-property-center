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
import { showSuccess } from "@/components/ui/toasts";
import { Spinner } from "@/components/ui/spinner";
import { useUserStore } from "@/store/useUserStore";
import { Eye, EyeOff } from "lucide-react";

// Zod validation schema
const formSchema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required."),
        newPassword: z
            .string()
            .min(6, "New password must be at least 6 characters long."),
        confirmPassword: z.string().min(1, "Please confirm your new password."),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match.",
    })
    .refine((data) => data.newPassword !== data.currentPassword, {
        path: ["newPassword"],
        message: "New password must be different from your current password.",
    });

export default function ChangePasswordPage() {
    const router = useRouter();

    const { user } = useUserStore();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!user) return;

        setLoading(true);
        try {
            const payload = { ...values, email: user.email };

            const res = await fetch("/api/agent/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const resData = await res.json() as { message: string, error: string, success: boolean };

            if (!resData.success) {
                setError(resData.message);
            } else {
                showSuccess("Password updated Succesfully!");
                setTimeout(() => {
                    router.back();
                }, 300);
            }
        } catch (error) {
            console.error(error);
            setError("Try again later.");
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
                            name="currentPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Enter current password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input                                                
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter new password"
                                                {...field}
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

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Re-enter new password" {...field}
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

                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-red-600 text-white"
                            disabled={loading}
                        >
                            {loading ? <><Spinner /> Updating...</> : "Update Password"}
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
