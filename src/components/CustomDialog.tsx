"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";

interface AnimatedAlertDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
    triggerButttonTitle?: string   
}

export function AnimatedAlertDialog({
    open,
    onOpenChange,
    title = "Confirm Action",
    description = "Are you sure you want to proceed?",
    onConfirm,
    confirmText = "Continue",
    cancelText = "Cancel",
    triggerButttonTitle,   
}: AnimatedAlertDialogProps) {

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            {triggerButttonTitle &&
                <AlertDialogTrigger asChild>
                    <Button
                        onClick={() => onOpenChange(true)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer"
                    >
                        {triggerButttonTitle}
                    </Button>
                </AlertDialogTrigger>
            }


            <AnimatePresence>
                {open && (
                    <AlertDialogContent asChild forceMount>
                        <motion.div
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 220,
                                damping: 25,
                                duration: 0.4,
                            }}
                            className="fixed bottom-0 left-0 right-0 z-50 mx-auto w-full max-w-lg rounded-t-2xl border bg-background p-6 shadow-lg"
                        >
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-lg font-semibold">
                                    {title}
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground">
                                    {description}
                                </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter className="mt-4 flex flex-row justify-end space-x-2">
                                <AlertDialogCancel
                                    className="border border-muted-foreground/20 hover:bg-muted/60"
                                    onClick={() => onOpenChange(false)}
                                >
                                    {cancelText}
                                </AlertDialogCancel>

                                <AlertDialogAction
                                    onClick={() => {
                                        onConfirm?.();
                                        onOpenChange(false);
                                    }}
                                >
                                    {confirmText}
                                </AlertDialogAction>

                            </AlertDialogFooter>

                        </motion.div>
                    </AlertDialogContent>
                )}
            </AnimatePresence>
        </AlertDialog>
    );
};

