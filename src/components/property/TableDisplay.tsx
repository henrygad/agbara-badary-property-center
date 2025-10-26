import React, { useState } from 'react'
import AdminCard from './AdminCard'
import { PropertyTypes } from '@/types/property.types'
import { Checkbox } from '../ui/checkbox'
import { cn } from '@/lib/utils'
import { CheckCircle, Clipboard, Eye, MoreVertical, Search, XCircle } from 'lucide-react'
import { formatDate } from '@/utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog'
import { showSuccess, showWarning } from '../ui/toasts'
import { useRouter } from 'next/navigation'
import Availability from './Availability'


type Props = {
    p: PropertyTypes
    selected?: string[],
    setSelected?: (s: string) => void
}

export default function TableDisplay({ p, selected, setSelected = () => { } }: Props) {
    const [displayDialogType, setDisplayDialogType] = useState({
        display: false,
        type: "Approve"
    });
    const router = useRouter();

    const handleApprove = (id?: string) => {
        if (!id) return;
        setDisplayDialogType({ display: false, type: "Reject" })        
        // send update in the DB
        // make upadte localy
        showSuccess("Property approved!");
    };

    const handleReject = (id?: string) => {
        if (!id) return;
        setDisplayDialogType({ display: false, type: "Reject" })
        // send update in the DB
        // make upadte localy
        showWarning("Property rejected!");
    };

    const handleReview = (p: PropertyTypes) => {
        // Save property temporarily in localStorage
        localStorage.setItem("reviewProperty", JSON.stringify(p))
        // Navigate to editor
        router.push("/admin/review-property");
    };
    const handleCopy = (id?: string) => {
        navigator.clipboard.writeText(
            `${window.location.origin}/property/${id}`
        );
        showSuccess("Copied", "Property link copied!");
    };


    return <>
        <tr
            className={cn(
                "border-t hover:bg-gray-50 dark:hover:bg-gray-800/50",
                selected?.includes(p.id || "") && "bg-gray-50 dark:bg-gray-800"
            )}
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

                    <DropdownMenuContent align="end" className="w-40 space-y-2 p-4">
                        {/* Review */}
                        <DropdownMenuItem
                            onClick={() => {
                                setDisplayDialogType({ display: true, type: "Review" })
                            }}
                        >
                            <Search className="w-4 h-4 mr-2 text-blue-500" />
                            Review
                        </DropdownMenuItem>

                        {/* Approve */}
                        <DropdownMenuItem
                            onClick={() => {
                                setDisplayDialogType({ display: true, type: "Approve" })
                            }}
                        >
                            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                            Approve
                        </DropdownMenuItem>

                        {/* Reject */}
                        <DropdownMenuItem
                            onClick={() => {
                                setDisplayDialogType({ display: true, type: "Reject" })

                            }}
                        >
                            <XCircle className="w-4 h-4 mr-2 text-red-600" />
                            Reject
                        </DropdownMenuItem>

                        {/* See */}
                        <DropdownMenuItem
                            onClick={() => {

                            }}
                        >
                            <Eye className="w-4 h-4 mr-2 text-indigo-500" />
                            See
                        </DropdownMenuItem>

                        {/* Copy Link */}
                        <DropdownMenuItem
                            onClick={() => handleCopy(p.id)}
                        >
                            <Clipboard className="w-4 h-4 mr-2 text-amber-500" />
                            Copy Link
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
                    <AlertDialogAction onClick={() => {
                        if (displayDialogType.type === "Approve") {
                            handleApprove(p.id)
                        } else if (displayDialogType.type === "Reject") {
                            handleReject(p.id)
                        } else if (displayDialogType.type === "Review") {
                            handleReview(p);
                        }
                    }}>
                        Yes
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog >
    </>;
};
