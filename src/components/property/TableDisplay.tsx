import React, { useState } from "react";
import AdminCard from "./AdminCard";
import { PropertyTypes } from "@/types/property.types";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import {
    CheckCircle,
    Clipboard,
    Copy,
    Edit,
    Eye,
    MoreVertical,
    RotateCcw,
    ShieldAlert,
    Trash2,
    XCircle,
} from "lucide-react";
import { formatDate } from "@/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../ui/alert-dialog";
import { showSuccess, showWarning } from "../ui/toasts";
import { useRouter } from "next/navigation";
import Availability from "./Availability";
import {
    deletePropertyDb,
    updatePropertyDb,
} from "@/lib/firebase/property_service";
import { usePropertyStore } from "@/store/usePropertyStore";
import OverlayLoader from "../loaders/OverlayLoader";

type Props = {
    p: PropertyTypes;
    selected?: string[];
    setSelected?: (s: string) => void;
    placeViewing: "Trash" | "Delete" | "Normal";
};

export default function TableDisplay({
    p,
    selected,
    setSelected = () => { },
    placeViewing
}: Props) {
    const { updateProperty, deleteProperty } = usePropertyStore();

    const [displayDialogType, setDisplayDialogType] = useState({
        display: false,
        type: "Approve",
    });

    const router = useRouter();

    const [loading, setLoading] = useState(false);


    const sendNotic = async (availability: string) => {
        try {
            const payload = {
                email: p.agentEmail,
                id: p.agentId,
                name: p.agentName,
                title: p.title,
                refId: p.referenceId,
                availability,
            };

            await fetch("/api/agent/property", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
        } catch (error) {
            console.error(error)
        }
    };

    const view = (id: string) => {
        if (!id) return;
        router.push("/properties/" + id);
    };

    const handleApprove = async (id?: string) => {
        if (!id || p.availability === "Accepted") return;
        setLoading(true);

        try {
            const res = await updatePropertyDb(id, { availability: "Accepted" });
            if (res) {
                updateProperty(res);
                setDisplayDialogType({ display: false, type: "Reject" });

                //Send notics
                await sendNotic("Accepted");

                showSuccess("Property approved!");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async (id?: string) => {
        if (!id || p.availability === "Rejected") return;
        setLoading(true);
        try {
            const res = await updatePropertyDb(id, { availability: "Rejected" });
            if (res) {
                updateProperty(res);
                setDisplayDialogType({ display: false, type: "Reject" });

                //Send notics
                await sendNotic("Rejected");

                showWarning("Property rejected!");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (p: PropertyTypes) => {
        if (!p || !p.id) return;
        setLoading(true);

        try {
            if (p.availability === "Reviewing") {
                // Save property temporarily in localStorage
                localStorage.setItem("reviewProperty", JSON.stringify(p));
                // Navigate to editor
                router.push("/admin/review-property");
            } else {
                const res = await updatePropertyDb(p.id, { availability: "Reviewing" });
                if (res) {
                    updateProperty(res);

                    //Send notics
                    await sendNotic("Reviewing");

                    // Save property temporarily in localStorage
                    localStorage.setItem("reviewProperty", JSON.stringify(res));
                    // Navigate to editor
                    router.push("/admin/review-property");
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (id?: string) => {
        navigator.clipboard.writeText(`${window.location.origin}/property/${id}`);
        showSuccess("Copied", "Property link copied!");
    };

    const handleDuplicate = (property: PropertyTypes) => {
        // Save property temporarily in localStorage
        localStorage.setItem("duplicateProperty", JSON.stringify(property));
        // Navigate to editor
        router.push("/admin/add-property");
    };

    const handleEdit = (property: PropertyTypes) => {
        // Save property temporarily in localStorage
        localStorage.setItem("updateProperty", JSON.stringify(property));
        // Navigate to editor
        router.push("/admin/add-property");
    };

    const handleTrash = async (id?: string) => {
        if (!id) return;
        setLoading(true);
        try {
            const res = await updatePropertyDb(id, { availability: "Trash" });
            if (res) {
                updateProperty(res);
                setDisplayDialogType({ display: false, type: "Trash" });
                showWarning("Property moved to Trash!");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id?: string) => {
        if (!id) return;
        setLoading(true);
        try {
            const res = await deletePropertyDb(id);
            if (res) {
                deleteProperty(id);
                setDisplayDialogType({ display: false, type: "Delete" });
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
                setDisplayDialogType({ display: false, type: "Restore" });
                showSuccess("Property Restore!");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <tr
                className={cn("border-t hover:bg-gray-50 dark:hover:bg-gray-800/50", selected?.includes(p.id || "") && "bg-gray-50 dark:bg-gray-800")}
                onClick={() => setSelected(p.id || "")}
            >
                {/* check for selection*/}
                {selected !== undefined && (
                    <td className="p-3">
                        <Checkbox
                            checked={selected.includes(p.id || "")}
                            onCheckedChange={() => setSelected(p.id || "")}
                        />
                    </td>
                )}
                {/* property card */}
                <td className="pl-2 pr-4 py-4 min-w-[320px]">
                    <AdminCard property={p} />
                </td>
                {/* availability */}
                <td className="px-4 py-4">
                    <Availability placeViewing="PREVIEW" availability={p.availability} />
                </td>
                <td className="px-4 py-4 min-w-[180px]">
                    <p className="line-clamp-1 text-sm">
                        {p.area} {p.city}
                        {", "}
                        {p.state}
                    </p>
                </td>
                <td className="px-4 py-4">
                    <p className="text-nowrap whitespace-pre text-sm">
                        {formatDate(p.updatedAt)}
                    </p>
                </td>

                {/* Menu */}
                <td className="px-4 py-4 text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            onClick={(e) => e.stopPropagation()}
                            align="end"
                            className="min-w-40 space-y-4 p-4"
                        >
                            {placeViewing === "Trash" ?
                                <>
                                    {/* Trash */}
                                    {p.availability === "Trash" ? (
                                        <>
                                            {/* Restore */}
                                            <DropdownMenuItem
                                                className="flex gap-2 items-center"
                                                onClick={() =>
                                                    setDisplayDialogType({ display: true, type: "Restore" })
                                                }
                                            >
                                                <RotateCcw className="w-4 h-4 mr-2 text-gray-600" />
                                                Restore
                                            </DropdownMenuItem>
                                            {/* Delete */}
                                            <DropdownMenuItem
                                                className="text-primary flex gap-2 items-center"
                                                onClick={() =>
                                                    setDisplayDialogType({ display: true, type: "Delete" })
                                                }
                                            >
                                                <Trash2 className="w-4 h-4 mr-2 text-gray-600" />
                                                Delete
                                            </DropdownMenuItem>
                                        </>
                                    ) : (
                                        null
                                    )}
                                </> :
                                <>
                                    {/* View */}
                                    <DropdownMenuItem
                                        className="flex gap-2 items-center"
                                        onClick={() => {
                                            view(p.id || "");
                                        }}
                                    >
                                        <Eye className="w-4 h-4 mr-2 text-gray-600" />
                                        View live
                                    </DropdownMenuItem>

                                    {/* Review */}
                                    <DropdownMenuItem
                                        className="flex gap-2 items-center"
                                        onClick={() => {
                                            setDisplayDialogType({ display: true, type: "Review" });
                                        }}
                                    >
                                        <ShieldAlert className="w-4 h-4 mr-2 text-gray-600" />
                                        Review
                                    </DropdownMenuItem>

                                    {/* Approve */}
                                    {p.availability !== "Accepted" && <DropdownMenuItem
                                        className="flex gap-2 items-center"
                                        onClick={() => {
                                            setDisplayDialogType({ display: true, type: "Approve" });
                                        }}
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2 text-gray-600" />
                                        Approve
                                    </DropdownMenuItem>}

                                    {/* Reject */}
                                    {p.availability !== "Rejected" && <DropdownMenuItem
                                        className="flex gap-2 items-center"
                                        onClick={() => {
                                            setDisplayDialogType({ display: true, type: "Reject" });
                                        }}
                                    >
                                        <XCircle className="w-4 h-4 mr-2 text-gray-600" />
                                        Reject
                                    </DropdownMenuItem>}

                                    {/* Copy Link */}
                                    <DropdownMenuItem
                                        onClick={() => handleCopy(p.id)}
                                        className="flex gap-2 items-center"
                                    >
                                        <Clipboard className="w-4 h-4 mr-2 text-gray-600" />
                                        Copy Link
                                    </DropdownMenuItem>

                                    {/* Edit */}
                                    <DropdownMenuItem                                        
                                        className="flex gap-2 items-center"
                                        onClick={() => handleEdit(p)}
                                    >
                                        <Edit className="w-4 h-4 mr-2 text-gray-600" />
                                        Edit
                                    </DropdownMenuItem>

                                    {/* Duplicate */}
                                    <DropdownMenuItem
                                        className="flex gap-2 items-center"
                                        onClick={() => handleDuplicate(p)}
                                    >
                                        <Copy className="w-4 h-4 mr-2 text-gray-600" />
                                        Duplicate
                                    </DropdownMenuItem>

                                    {/* Trash */}
                                    <DropdownMenuItem
                                        className="text-primary flex gap-2 items-center"
                                        onClick={() =>
                                            setDisplayDialogType({ display: true, type: "Trash" })
                                        }
                                    >
                                        <Trash2 className="w-4 h-4 mr-2 text-gray-600" />
                                        Trash
                                    </DropdownMenuItem>                                  
                                </>
                            }

                        </DropdownMenuContent>
                    </DropdownMenu>
                </td>
            </tr>

            <AlertDialog
                open={displayDialogType.display}
                onOpenChange={() =>
                    setDisplayDialogType({ display: false, type: "Reject" })
                }
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {displayDialogType.type} Property
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-wrap">
                            Do you want to {displayDialogType.type} “{p.title}”?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-primary text-white"
                            onClick={() => {
                                if (displayDialogType.type === "Approve") {
                                    handleApprove(p.id);
                                } else if (displayDialogType.type === "Reject") {
                                    handleReject(p.id);
                                } else if (displayDialogType.type === "Review") {
                                    handleReview(p);
                                } else if (displayDialogType.type === "Trash") {
                                    handleTrash(p.id);
                                } else if (displayDialogType.type === "Delete") {
                                    handleDelete(p.id);
                                } else if (displayDialogType.type === "Restore") {
                                    handleRestore(p.id);
                                }
                            }}
                        >
                            Yes
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <OverlayLoader
                loading={loading}
            />
        </>
    );
}
