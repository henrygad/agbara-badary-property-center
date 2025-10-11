"use client";

import { useEffect } from "react";

const useClickOutSide = (ref: React.MutableRefObject<HTMLElement | null>, callBack: () => void) => {

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent | TouchEvent) => {          
            if (!ref.current || ref.current.contains(e.target as Node)) {
                return;
            } else {               
                callBack();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [ref, callBack]);
};

export default useClickOutSide;
