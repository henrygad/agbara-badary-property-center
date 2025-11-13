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

    const [loading, setLoading] = useState(false);

    const filterTrash = useMemo(() => properties.filter(p => p.availability === "Trash" && p.accountType === "Admin"), [properties]);

    if (loadingProperties) return <PageLoading loading={loadingProperties} />

    const allChecked = selected.length === filterTrash.length;

    const toggleSelectAll = () => {
        if (allChecked) setSelected([]);
        else {
            setSelected(filterTrash.map(p => p.id || ""));           
        }
    };

    const toggleSelect = (id: string) => {
        setSelected((pre) =>
            pre.includes(id) ? pre.filter(s => s !== id) : [...pre, id]
        );       
    };

    const handleDelete = async (id?: string) => {
        if (!id) return;
        setLoading(true);
        try {
            const res = await deletePropertyDb(id);
            if (res) {
                deleteProperty(id);             
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
            const res = await updatePropertyDb(id, { availability: "Accepted" });                 

            if (res) {
                updateProperty(res);                
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const deleteAll = async () => {
        await Promise.all(selected.map((s) => handleDelete(s)));
        showWarning("Property Delete!");
    };

    const restoreAll = async () => {
        await Promise.all(selected.map(s => handleRestore(s)));
        showSuccess("Property Restore!");
    };

    return (
        <div className="w-full">
            {selected.length > 0 &&
                <div className="flex justify-between items-center shadow w-full p-3 mb-4">
                    <Button
                        variant="ghost"
                        onClick={() => setSelected([])}
                    >
                        <X size={20} />
                    </Button>
                    <div className="flex-1 flex justify-end gap-3 flex-wrap items-center">
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
                    </div>
                </div>
            }

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
                                    <td colSpan={6}>
                                        <ItemNotFound>No trash yet.</ItemNotFound>
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
