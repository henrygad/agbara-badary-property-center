"use client";

import {
    Drawer,  
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from "@/components/ui/drawer";
import { ReactElement } from "react";

type Props = {
    open: boolean
    setOpen: (open: boolean) => void
    children: ReactElement,   
}


export default function Modal({ open, setOpen, children }: Props) {
    
    return (
        <Drawer open={open} onOpenChange={setOpen} >         
            <DrawerContent className="text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-900">                                         
                <DrawerHeader className="hidden">
                    <DrawerTitle></DrawerTitle>   
                    <DrawerDescription></DrawerDescription>
                </DrawerHeader>
                   {children}                                
            </DrawerContent>
        </Drawer>
    );   
}
