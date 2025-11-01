"use client"

import { Check, Star, ShieldCheck, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PropertyTypes } from "@/types/property.types"
import { useRouter } from "next/navigation"


export function CardMenu({ property }: { property: PropertyTypes }) {
    const statuses = ["For Sale", "For Rent", "Sold", "Rented", "Archived"]
    const router = useRouter()

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

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {/* Basic Actions */}
                <DropdownMenuItem>View</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => handleEdit(property)}>Edit</DropdownMenuItem>
                <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleDuplicate(property)}>Duplicate</DropdownMenuItem>
                <DropdownMenuItem>Copy Link</DropdownMenuItem>

                {/* Status Section */}
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                {statuses.map((status) => (
                    <DropdownMenuItem
                        key={status}
                    >
                        {status}
                        {property?.status === status && (
                            <Check className="ml-auto h-4 w-4 text-green-500" />
                        )}
                    </DropdownMenuItem>
                ))}

                {/* Featured Section */}
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Promotion</DropdownMenuLabel>
                <DropdownMenuItem
                >
                    <Star className="mr-2 h-4 w-4" />
                    {property?.packageType === "Featured" ? "Unfeature" : "Mark as Featured"}
                </DropdownMenuItem>

                {/* Verification Section */}
                <DropdownMenuItem

                >
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    {property?.availability === "Pending" ? "Unverify" : "Mark as Verified"}
                </DropdownMenuItem>

                {/* Danger Zone */}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => alert("Property deleted")}
                >
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
