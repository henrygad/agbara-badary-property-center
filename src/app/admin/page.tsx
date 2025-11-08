"use client";

import MetricCard from "@/components/MetricCard";
import TableDisplay from "@/components/property/TableDisplay";
import { Button } from "@/components/ui/button";
import { Building2, Clock, Inbox, Users, Plus } from "lucide-react";
import { useMemo } from "react";
import { usePropertyStore } from "@/store/usePropertyStore";
import { useRouter } from "next/navigation";
import GroundLoader from "@/components/loaders/GroundLoader";
import Agent from "@/components/Agent";
import { useAgentStore } from "@/store/useAgentStore";
import { useRequestStore } from "@/store/useRequestStore";
import RequestCrad from "@/components/RequestCrad";
import { calculateChange } from "@/utils/metrics_cal";
import ItemNotFound from "@/components/ItemNotFound";

export default function AdminDashboard() {
    const router = useRouter();

    const { properties, loading: loadingProperties } = usePropertyStore();

    const { agents, loading: loadingAgents } = useAgentStore();

    const { requests, loading: loadingRequests } = useRequestStore();

    const onlyPendingProperties = useMemo(() =>
        properties.filter(p => p.availability === "Pending" || p.availability === "Reviewing"),
        [properties]
    );

    const onlyPendingAgents = useMemo(() =>
        agents.filter(a => a.accountStatus === "Pending" || a.accountStatus === "Rejected"),
        [agents]
    );

    const onlyUnviewRequests = useMemo(() =>
        requests.filter(r => !r.view),
        [requests]
    );

    const propertyStats = calculateChange(properties, "month");
    const pendingStats = calculateChange(onlyPendingProperties, "week");
    const requestStats = calculateChange(requests, "month");
    const agentStats = calculateChange(agents, "month");

    
    return <div className="h-auto w-full">
        {/* Key Metric */}
        <div className="w-full flex justify-end mb-10">
            <h3 className="text-base">
                Welcome back, Admin!
            </h3>
        </div>
        {/* Quick buttons */}
        <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-text-light dark:text-text-dark">
                Quick Actions
            </h3>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-2">
                Perform common administrative tasks
            </p>
            <div className="py-4">
                <div className="flex flex-wrap gap-4">
                    <Button
                        className="gap-2 py-4 flex items-center cursor-pointer"
                        variant="destructive"
                        datatype="icon"
                        onClick={() => router.push("/admin/add-property")}
                    >
                        <Plus className="h-5 w-5" />
                        Add Property
                    </Button>
                    <Button
                        className="gap-2 py-4 flex items-center cursor-pointer"
                        variant="ghost"
                        onClick={() => router.push("/admin/agents")}
                    >
                        <Users className="h-5 w-5" />
                        Manage Agents
                    </Button>
                    <Button
                        className="gap-2 py-4 flex items-center cursor-pointer"
                        variant="outline"
                        onClick={() => router.push("/admin/requests")}
                    >
                        <Inbox className="h-5 w-5" />
                        Manage Requests
                    </Button>

                </div>
            </div>
        </section>
        {/* Metric feature */}
        <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-text-light dark:text-text-dark">
                Key Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Properties"
                    value={properties.length}
                    change={propertyStats.change}
                    icon={Building2}
                    iconColor="text-indigo-500 dark:text-indigo-400"
                />
                <MetricCard
                    title="Pending Listings"
                    value={onlyPendingProperties.length}
                    change={pendingStats.change}
                    icon={Clock}
                    iconColor="text-orange-500 dark:text-orange-400"
                />
                <MetricCard
                    title="Requests"
                    value={requests.length}
                    change={requestStats.change}
                    icon={Inbox}
                    iconColor=" text-cyan-500 dark:text-cyan-400"
                />
                <MetricCard
                    title="Active Agents"
                    value={agents.length}
                    change={agentStats.change}
                    icon={Users}
                    iconColor="text-green-500"
                />
            </div>
        </section>
        {/* Performance Metrics */}
        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2 text-text-light dark:text-text-dark">
                Performance Metrics
            </h2>
            {!loadingProperties ? <div className="mb-8 mt-6">
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
                    Listings requiring your attention
                </p>
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
                            {onlyPendingProperties.length > 0 ? (
                                onlyPendingProperties.map((p) => (
                                    <TableDisplay
                                        key={p.id}
                                        p={p}
                                        placeViewing="Normal"
                                    />
                                ))
                            ) : (
                                <tr>
                                        <td colSpan={6}>
                                            <ItemNotFound>Clear</ItemNotFound>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div> :
                <GroundLoader loading={loadingProperties} />
            }
            {!loadingAgents ? <div className="mb-8">
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
                    Agent accounts requiring your attention
                </p>
                {/* Table */}
                <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-900 mt-6">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr>
                                <th className="p-3 text-left whitespace-pre text-nowrap">Full Name</th>
                                <th className="p-3 text-left whitespace-pre text-nowrap">Email</th>
                                <th className="p-3 text-left whitespace-pre text-nowrap">Status</th>
                                <th className="p-3 text-left whitespace-pre text-nowrap">Joined</th>
                                <th className="p-3 text-right whitespace-pre text-nowrap">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {onlyPendingAgents.length > 0 ? (
                                onlyPendingAgents.map((agent) => (
                                    <Agent agent={agent} key={agent.id} />
                                ))
                            ) : (
                                <tr>
                                    <td
                                            colSpan={6}                                        
                                    >
                                            <ItemNotFound>Clear</ItemNotFound>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div> :
                <GroundLoader loading={loadingAgents} />
            }

            <div className="mb-8">
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
                    Requests requiring your attention
                </p>
                {!loadingRequests ? <div>
                    {onlyUnviewRequests.length === 0 ? (
                        <ItemNotFound>Clear</ItemNotFound>
                    ) : (
                        <ul className="space-y-3">
                            {onlyUnviewRequests.map((req) => (
                                <RequestCrad
                                    key={req.id}
                                    req={req}
                                />
                            ))}
                        </ul>
                    )}

                </div> :
                    <GroundLoader loading={loadingRequests} />
                }
            </div>


        </section>

    </div>;
}
