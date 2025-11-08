"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface AnalyticsChartProps {
    data: {
        month: string;
        properties: number;
        requests: number;
    }[];
}

export default function AnalyticsCharts({ data }: AnalyticsChartProps) {
    const [period, setPeriod] = useState<"month" | "week">("month");

    // Simulated filtering logic for demo (replace with your real monthly/weekly logic)
    const filteredData =
        period === "month"
            ? data
            : data.slice(-4).map((d) => ({
                ...d,
                month: `W${Math.floor(Math.random() * 4) + 1}`,
            }));

    return (
        <div className="space-y-10">
            {/* Properties Analytics */}
            <Card className="rounded-2xl shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold">
                        <p className="text-sm font-semibold"> Properties Analytics</p>
                    </CardTitle>

                    <Select
                        value={period}
                        onValueChange={(value: "month" | "week") => setPeriod(value)}
                    >
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="month">Monthly</SelectItem>
                            <SelectItem value="week">Weekly</SelectItem>
                        </SelectContent>
                    </Select>
                </CardHeader>

                <CardContent>
                    <div className="h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={filteredData}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    className="stroke-gray-200 dark:stroke-gray-700"
                                />
                                <XAxis
                                    dataKey="month"
                                    stroke="#9ca3af"
                                    tick={{ fill: "currentColor" }}
                                />
                                <YAxis stroke="#9ca3af" tick={{ fill: "currentColor" }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "var(--background)",
                                        border: "1px solid var(--border)",
                                        color: "var(--foreground)",
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="properties"
                                    stroke="#dc2626" // red-600
                                    strokeWidth={2}
                                    activeDot={{ r: 6 }}
                                    name="Properties"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Requests Analytics */}
            <Card className="rounded-2xl shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold">                        
                        <p className="text-sm font-semibold">Requests Analytics</p>
                    </CardTitle>

                    <Select
                        value={period}
                        onValueChange={(value: "month" | "week") => setPeriod(value)}
                    >
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="month">Monthly</SelectItem>
                            <SelectItem value="week">Weekly</SelectItem>
                        </SelectContent>
                    </Select>
                </CardHeader>

                <CardContent>
                    <div className="h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={filteredData}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    className="stroke-gray-200 dark:stroke-gray-700"
                                />
                                <XAxis
                                    dataKey="month"
                                    stroke="#9ca3af"
                                    tick={{ fill: "currentColor" }}
                                />
                                <YAxis stroke="#9ca3af" tick={{ fill: "currentColor" }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "var(--background)",
                                        border: "1px solid var(--border)",
                                        color: "var(--foreground)",
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="requests"
                                    stroke="#2563eb" // blue-600
                                    strokeWidth={2}
                                    activeDot={{ r: 6 }}
                                    name="Requests"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

