"use client";

import TableDisplay from "@/components/property/TableDisplay";
import { Button } from "@/components/ui/button";
import { Clock, MailWarning, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { usePropertyStore } from "@/store/usePropertyStore";
import { useRouter } from "next/navigation";
import GroundLoader from "@/components/loaders/GroundLoader";
import { useUserStore } from "@/store/useUserStore";
import { showError, showSuccess } from "@/components/ui/toasts";
import { cn } from "@/lib/utils";
import OverlayLoader from "@/components/loaders/OverlayLoader";
import ItemNotFound from "@/components/ItemNotFound";

export default function AdminDashboard() {
    const { user } = useUserStore();
    const [loading, setLoading] = useState(false);


    const router = useRouter();

    const { properties, loading: loadingProperties } = usePropertyStore();

    const onlyPeningProperties = useMemo(() =>
        properties.filter(p => p.availability === "Pending" || p.availability === "Reviewing"),
        [properties]
    );

    const verifyEmailSendOtp = async () => {
        if (!user || !user.email) return;
        const email = user.email;

        setLoading(true)
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
            console.error(error);
            showError("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return <div className="h-auto w-full">
        {/* Key Metric */}
        <div className="w-full flex justify-end mb-10">
            <h3 className="text-base">
                Welcome back, Agent!
            </h3>
        </div>

        <section>
            <div className="space-y-3 mb-4">
                {/* Email Not Verified */}
                {user &&
                    !user.emailIsVerified &&
                    <button onClick={verifyEmailSendOtp}>
                        <div
                            className={cn(
                                "flex items-center justify-between rounded-lg border px-4 py-3 transition hover:bg-red-50 cursor-pointer",
                                "border-red-200 bg-red-100/50"
                            )}
                        >
                            <div className="flex items-center gap-2 text-sm text-red-700">
                                <MailWarning className="h-5 w-5 text-red-600" />
                                <span>Your email is not verified. Please verify to unlock all features.</span>
                            </div>
                            <span className="text-sm font-medium text-red-700 underline">
                                Verify now →
                            </span>
                        </div>
                    </button>
                }
                {/* Account Pending Approval */}
                {user &&
                    user.accountStatus === "Pending" &&
                    <div className="flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-100/50 px-4 py-3">
                        <div className="flex items-center gap-2 text-sm text-yellow-700">
                            <Clock className="h-5 w-5 text-yellow-600" />
                            <span>Your account is still pending admin approval.</span>
                        </div>
                        <span className="text-xs text-yellow-700 font-medium">
                            Waiting for review
                        </span>
                    </div>
                }
            </div>
        </section>

        {/* Quick buttons */}
        <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-text-light dark:text-text-dark">
                Quick Actions
            </h3>
            <div className="py-4">
                <div className="flex flex-wrap gap-4">
                    <Button
                        className="gap-2 py-4 flex items-center cursor-pointer"
                        variant="destructive"
                        datatype="icon"
                        onClick={() => router.push("/agent/add-property")}
                    >
                        <Plus className="h-5 w-5" />
                        Add Property
                    </Button>
                </div>
            </div>
        </section>

        {/* Performance Metrics */}
        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2 text-text-light dark:text-text-dark">
                Pending Listings
            </h2>
            {!loadingProperties ? <div className="mb-8 mt-6">
                {/* Table */}
                <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-900">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr>
                                <th className="px-4 py-3 text-left text-nowrap whitespace-pre">Property Details</th>
                                <th className="px-4 py-3 text-left text-nowrap whitespace-pre">Availability</th>
                                <th className="px-4 py-3 text-left text-nowrap whitespace-pre">Location</th>
                                <th className="px-4 py-3 text-left text-nowrap whitespace-pre">Last Updated</th>
                                <th className="px-4 py-3 text-right text-nowrap whitespace-pre">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {onlyPeningProperties.length > 0 ? (
                                onlyPeningProperties.map((p) => (
                                    <TableDisplay
                                        key={p.id}
                                        p={p}
                                        placeViewing="Normal"
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={6}
                                    >
                                        <ItemNotFound>
                                            Clear
                                        </ItemNotFound>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div> :
                <GroundLoader loading={loadingProperties} />
            }

        </section>

        <OverlayLoader loading={loading} />
    </div>;
}
