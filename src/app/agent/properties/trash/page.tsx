"use client";

import { useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import TableDisplay from "@/components/property/TableDisplay";
import { usePropertyStore } from "@/store/usePropertyStore";
import PageLoading from "@/components/loaders/PageLoader";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { deletePropertyDb, updatePropertyDb } from "@/lib/firebase/property_service";
import { showSuccess, showWarning } from "@/components/ui/toasts";
import OverlayLoader from "@/components/loaders/OverlayLoader";
import ItemNotFound from "@/components/ItemNotFound";

export default function ListPropertiesPage() {
    const { properties, loading: loadingProperties, deleteProperty, updateProperty } = usePropertyStore();

    const [selected, setSelected] = useState<string[]>([]);
    const [allChecked, setAllChecked] = useState(false);

    const [loading, setLoading] = useState(false);

    const filterTrash = useMemo(() => properties.filter(p => p.availability === "Trash"), [properties]);

    if (loadingProperties) return <PageLoading loading={loadingProperties} />

    const toggleSelectAll = () => {
        if (allChecked) setSelected([]);
        else {
            setSelected(filterTrash.map(p => p.id || ""));
            setAllChecked(true);
        }
    };

    const toggleSelect = (id: string) => {
        setSelected((pre) =>
            pre.includes(id) ? pre.filter(s => s !== id) : [...pre, id]
        );
        setAllChecked(true);
    };


    const handleDelete = async (id?: string) => {
        if (!id) return;
        setLoading(true);
        try {
            const res = await deletePropertyDb(id);
            if (res) {
                deleteProperty(id);
                showWarning("Property Delete!");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (id?: string) => {
        if (!id) return;
        setLoading(true);
        try {
            const res = await updatePropertyDb(id, { availability: "Pending" });
            if (res) {
                updateProperty(res);
                showSuccess("Property Restore!");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const deleteAll = () => {
        selected.map((s) => {
            handleDelete(s);
        });
    };

    const restoreAll = () => {
        selected.map(s => {
            handleRestore(s);
        })
    };


    return (
        <div className="w-full">
            {selected.length > 0 &&
                <div className="relative flex justify-end gap-2 px-2 items-center shadow-sm">
                    <div className="absolute top-1/2 -translate-1/2 left-3">
                        <Button
                            variant="ghost"
                            onClick={() => setSelected([])}
                        >
                            <X size={20} />
                        </Button>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={restoreAll}
                    >
                        Restore all
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={deleteAll}
                    >
                        Delete all
                    </Button>
                </div>}
            <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-900">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                            <th>
                                <Checkbox checked={allChecked} onCheckedChange={toggleSelectAll} />
                            </th>
                            <th className="px-4 py-3 text-left text-nowrap whitespace-pre">Property Details</th>
                            <th className="px-4 py-3 text-left text-nowrap whitespace-pre">Availability</th>
                            <th className="px-4 py-3 text-left text-nowrap whitespace-pre">Location</th>
                            <th className="px-4 py-3 text-left text-nowrap whitespace-pre">Last Updated</th>
                            <th className="px-4 py-3 text-right text-nowrap whitespace-pre">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filterTrash.length > 0 ? (
                            filterTrash.map((p) => (
                                <TableDisplay
                                    key={p.id}
                                    p={p}
                                    selected={selected}
                                    setSelected={toggleSelect}
                                    placeViewing={"Trash"}
                                />
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={6}
                                >
                                    <ItemNotFound>No properties found.</ItemNotFound>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <OverlayLoader loading={loading} />
        </div>
    );
};
