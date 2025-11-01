"use client";

import {
    Drawer,  
    DrawerContent,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Props = {
    open: boolean
    setOpen: (open: boolean) => void
    children: ReactNode,
    className?: string
}


export default function Modal({ open, setOpen, children, className = "" }: Props) {
    
    return (
        <Drawer open={open} onOpenChange={setOpen} >         
            <DrawerContent
                className={cn("text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 p-0", className)}
            >
                {children}    
                

            </DrawerContent>
        </Drawer>
    );   
}
