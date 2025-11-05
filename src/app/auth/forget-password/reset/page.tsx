"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const changePassword = z.object({
    email: z.string(),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
})
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });

export type changePasswordSchema = z.infer<typeof changePassword>;

export default function ResetPassword() {
    const query = useSearchParams();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm<changePasswordSchema>({
        resolver: zodResolver(changePassword),
        defaultValues: {
            password: "",
            confirmPassword: ""
        },
    });

    const onSubmit = async (data: changePasswordSchema) => {
        if (loading) return;
        setError("");
        setLoading(true);

        try {

            const payload = { newPassword: data.password, email: data.email };

            const res = await fetch("/api/reset-password", {
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
                router.push("/auth/forget-password/reset/success");
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

    // Auto fill email
    useEffect(() => {
        const emailParam = query.get("email");
        if (emailParam) {
            form.setValue("email", emailParam);
        }
    }, [query, form]);  

    return <div className="flex justify-center items-center w-full px-3 py-10">
        <div className="space-y-8 bg-white shadow-md rounded-md p-8 md:p-12 md:max-w-4xl">
            {/* Header */}
            <div className="space-y-1 text-center">
                <h2 className="text-primary text-xl md:text-2xl font-semibold">
                    Reset Password
                </h2>
                <p className="text-gray-600 text-sm">
                    {"Enter your new password"}
                </p>
            </div>

            {/* Register Form */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
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

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-red-600"
                    >
                        {loading ? (
                            <>
                                <Spinner /> Reseting...
                            </>
                        ) : (
                            "Reset password"
                        )}
                    </Button>

                    <p className="text-primary text-xs font-normal w-ful text-center mt-1">
                        {error}
                    </p>

                </form>
            </Form>

        </div>
    </div >
};

