import React, { useState } from 'react'
import AdminCard from './AdminCard'
import { PropertyTypes } from '@/types/property.types'
import { Checkbox } from '../ui/checkbox'
import { cn } from '@/lib/utils'
import { CheckCircle, Clipboard, Copy, Edit, Eye, Flag, MoreVertical, ShieldAlert, Trash2, XCircle } from 'lucide-react'
import { formatDate } from '@/utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog'
import { showSuccess, showWarning } from '../ui/toasts'
import { useRouter } from 'next/navigation'
import Availability from './Availability'
import { deletePropertyDb, updatePropertyDb } from '@/lib/firebase/property_service'
import { usePropertyStore } from '@/store/usePropertyStore'
import OverlayLoader from '../loaders/OverlayLoader'


type Props = {
    p: PropertyTypes
    selected?: string[],
    setSelected?: (s: string) => void
}

export default function TableDisplay({ p, selected, setSelected = () => { } }: Props) {
    const { updateProperty, deleteProperty } = usePropertyStore();


    const [displayDialogType, setDisplayDialogType] = useState({
        display: false,
        type: "Approve"
    });
    const router = useRouter();

    const [loadingApproved, setLoadingApproved] = useState(false);
    const [loadingReject, setLoadingReject] = useState(false);
    const [loadingReview, setLoadingReview] = useState(false);
    const [loadingTrash, setLoadingTrash] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const view = (id: string) => {
        if (!id) return;
        router.push("/properties/" + id);
    };

    const handleApprove = async (id?: string) => {
        if (!id || p.availability === "Accepted") return;
        setLoadingApproved(true);

        try {
            const res = await updatePropertyDb(id, { availability: "Accepted" });
            if (res) {
                updateProperty(res);
                setDisplayDialogType({ display: false, type: "Reject" })                        
                showSuccess("Property approved!");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingApproved(false);
        }
    };

    const handleReject = async (id?: string) => {
        if (!id || p.availability === "Rejected") return;
        setLoadingReject(true);
        try {
            const res = await updatePropertyDb(id, { availability: "Rejected" });
            if (res) {
                updateProperty(res);
                setDisplayDialogType({ display: false, type: "Reject" })
                showWarning("Property rejected!");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingReject(false);
        }
    };

    const handleReview = async (p: PropertyTypes) => {
        if (!p || !p.id) return;
        setLoadingReview(true);

        try {
            if (p.availability === "Reviewing") {
                // Save property temporarily in localStorage
                localStorage.setItem("reviewProperty", JSON.stringify(p))
                // Navigate to editor
                router.push("/admin/review-property");
            } else {
                const res = await updatePropertyDb(p.id, { availability: "Reviewing" });
                if (res) {
                    updateProperty(res);
                    // Save property temporarily in localStorage
                    localStorage.setItem("reviewProperty", JSON.stringify(res))
                    // Navigate to editor
                    router.push("/admin/review-property");
                }

            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingReview(false);
        }        
    };

    const handleCopy = (id?: string) => {
        navigator.clipboard.writeText(
            `${window.location.origin}/property/${id}`
        );
        showSuccess("Copied", "Property link copied!");
    };

    const handleDuplicate = (property: PropertyTypes) => {
        // Save property temporarily in localStorage
        localStorage.setItem("duplicateProperty", JSON.stringify(property))
        // Navigate to editor
        router.push("/admin/add-property")
    };

    const handleEdit = (property: PropertyTypes) => {
        // Save property temporarily in localStorage
        localStorage.setItem("updateProperty", JSON.stringify(property))
        // Navigate to editor
        router.push("/admin/add-property")
    };

    const handleTrash = async (id?: string) => {
        if (!id) return;
        setLoadingTrash(true);
        try {
            const res = await updatePropertyDb(id, { availability: "Trash" });
            if (res) {
                updateProperty(res);
                setDisplayDialogType({ display: false, type: "Trash" })
                showWarning("Property moved to Trash!");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingReject(false);
        }
    }

    const handleDelete = async (id?: string) => {
        if (!id) return;
        setLoadingDelete(true);
        try {
            const res = await deletePropertyDb(id);
            if (res) {
                deleteProperty(id);
                setDisplayDialogType({ display: false, type: "Delete" })
                showWarning("Property Delete!");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingDelete(false);
        }
    };

    const handleReport = async (id?: string) => {
        if (!id) return;
        router.push("/contact");
    };


    return <>
        <tr
            className={cn(
                "border-t hover:bg-gray-50 dark:hover:bg-gray-800/50",
                selected?.includes(p.id || "") && "bg-gray-50 dark:bg-gray-800"
            )}
            onClick={() => setSelected(p.id || "")}
        >
            {/* check for selection*/}
            {selected !== undefined &&
                <td className="p-3">
                <Checkbox
                    checked={selected.includes(p.id || "")}
                    onCheckedChange={() => setSelected(p.id || "")}
                />
            </td>}
            {/* property card */}
            <td className="pl-2 pr-4 py-4 min-w-[320px]">
                <AdminCard property={p} />
            </td>
            {/* availability */}
            <td className="px-4 py-4">
                <Availability placeViewing="PREVIEW" availability={p.availability} />
            </td>
            <td className="px-4 py-4 min-w-[180px]">
                <p className='line-clamp-1 text-sm'>{p.area}{" "}{p.city}{", "}{p.state}</p>
            </td>
            <td className="px-4 py-4">
                <p className='text-nowrap whitespace-pre text-sm'>
                    {formatDate(p.updatedAt)}

                </p>
            </td>

            <td className="px-4 py-4 text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent onClick={(e)=> e.stopPropagation()} align="end" className="w-40 space-y-2 p-4">

                        {/* View */}
                        <DropdownMenuItem
                            onClick={() => {
                                view(p.id || "");
                            }}
                        >
                            <Eye className="w-4 h-4 mr-2 text-ingray-text-gray-600" />
                            View live
                        </DropdownMenuItem>

                        {/* Review */}
                        <DropdownMenuItem
                            onClick={() => {
                                setDisplayDialogType({ display: true, type: "Review" })
                            }}
                        >
                            <ShieldAlert className="w-4 h-4 mr-2 text-gray-600" />
                            Review
                        </DropdownMenuItem>

                        {/* Approve */}
                        <DropdownMenuItem
                            onClick={() => {
                                setDisplayDialogType({ display: true, type: "Approve" })
                            }}
                        >
                            <CheckCircle className="w-4 h-4 mr-2 text-ggray-text-gray-600" />
                            Approve
                        </DropdownMenuItem>

                        {/* Reject */}
                        <DropdownMenuItem
                            onClick={() => {
                                setDisplayDialogType({ display: true, type: "Reject" })

                            }}
                        >
                            <XCircle className="w-4 h-4 mr-2 textgray-text-gray-600" />
                            Reject
                        </DropdownMenuItem>

                        {/* Copy Link */}
                        <DropdownMenuItem
                            onClick={() => handleCopy(p.id)}
                        >
                            <Clipboard className="w-4 h-4 mr-2 text-agray-text-gray-600" />
                            Copy Link
                        </DropdownMenuItem>

                        {/* Edit */}
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => handleEdit(p)}
                        >
                            <Edit className="w-4 h-4 mr-2 text-agray-text-gray-600" />
                            Edit
                        </DropdownMenuItem>

                        {/* Duplicate */}
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => handleDuplicate(p)}
                        >
                            <Copy className="w-4 h-4 mr-2 text-agray-text-gray-600" />
                            Duplicate
                        </DropdownMenuItem>


                        {/* Trash */}
                        <DropdownMenuItem
                            className="text-primary"
                            onClick={() => setDisplayDialogType({ display: true, type: "Trash" })}
                        >
                            <Trash2 className="w-4 h-4 mr-2 text-agray-text-gray-600" />
                            Trash
                        </DropdownMenuItem>

                        {/* Delete */}
                        <DropdownMenuItem
                            className="text-primary"
                            onClick={() => setDisplayDialogType({ display: true, type: "Delete" })}
                        >
                            <Trash2 className="w-4 h-4 mr-2 text-agray-text-gray-600" />
                            Delete
                        </DropdownMenuItem>

                        {/* Report */}
                        <DropdownMenuItem
                            className="text-primary"
                            onClick={() => handleReport(p.id)}
                        >
                            <Flag className="w-4 h-4 mr-2 text-agray-text-gray-600" />
                            Report
                        </DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>
            </td>
        </tr>


        <AlertDialog
            open={displayDialogType.display}
            onOpenChange={() => setDisplayDialogType({ display: false, type: "Reject" })}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{displayDialogType.type} Property</AlertDialogTitle>
                    <AlertDialogDescription className='text-wrap'>
                        Do you want to {displayDialogType.type} “{p.title}”?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className='text-primary text-white' onClick={() => {
                        if (displayDialogType.type === "Approve") {
                            handleApprove(p.id)
                        } else if (displayDialogType.type === "Reject") {
                            handleReject(p.id)
                        } else if (displayDialogType.type === "Review") {
                            handleReview(p);
                        } else if (displayDialogType.type === "Trash") {
                            handleTrash(p.id);
                        } else if (displayDialogType.type === "Delete") {
                            handleDelete(p.id);
                        }
                    }}>
                        Yes
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog >
        <OverlayLoader loading={(
            loadingApproved ||
            loadingDelete || 
            loadingReject ||
            loadingReview ||
            loadingTrash ||
            loadingDelete             
            )} />
    </>;
};
