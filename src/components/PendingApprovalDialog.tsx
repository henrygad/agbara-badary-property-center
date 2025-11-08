"use client";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

interface PendingApprovalDialogProps {
    open: boolean;
    onClose: () => void;
    onSaveDraft: () => void;
}

export function PendingApprovalDialog({
    open,
    onClose,
    onSaveDraft,
}: PendingApprovalDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader className="flex flex-col items-center text-center space-y-3">
                    <div className="rounded-full bg-yellow-100 p-3">
                        <AlertTriangle className="text-yellow-600 h-6 w-6" />
                    </div>
                    <AlertDialogTitle className="text-lg font-semibold">
                        Account Approval Pending
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                        Your account is still under review by the admin team. You cannot
                        publish new listings until approval is complete.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="flex justify-end space-x-2 mt-4">
                    <AlertDialogCancel
                        onClick={onClose}
                        className="border border-gray-300"
                    >
                        Close
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onSaveDraft}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                        Save as Draft
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
