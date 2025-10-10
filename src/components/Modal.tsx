import { ReactElement } from "react";

export default function Modal(
    { children, isOpen}:
        { children: ReactElement, isOpen: boolean, setIsOpen: (b: boolean) => void }
) {
    return <div id="modal" className="relative">
        {isOpen && <div className="fixed top-0 right-0 left-0 bottom-0 w-full h-full flex flex-col justify-center items-center">
            {children}
        </div>}
    </div>
};