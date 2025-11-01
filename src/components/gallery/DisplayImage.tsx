"use client";

import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { ImageIcon, Trash2, User } from "lucide-react";
import ImageTypes from "@/types/image.types";
import { getOptimizedImage } from "@/utils";
import { cn } from "@/lib/utils";

type Props = {
    src: string
    alt?: string
    className?: string
    metaData?: ImageTypes
    selected?: ImageTypes[]
    setSelected?: Dispatch<SetStateAction<ImageTypes[]>>
    useRemove?: boolean
    remove?: (img: ImageTypes | string) => void
    type?: "Profile" | "Property",
    imageObjectCover?: string
};

const DisplayImage = ({ src, alt = "Property", type = "Property", imageObjectCover = "object-cover", metaData, selected, setSelected = () => { }, useRemove = true, remove = () => null, className }: Props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const handleLoad = () => setIsLoading(false);
    const handleError = () => {
        setIsError(true);
        setIsLoading(false);
    };

    const handleSelect = () => {
        if (isError || !src.trim() || !metaData) return;
        setSelected(pre => {
            const copy = new Set(pre);
            if (copy.has(metaData)) {
                copy.delete(metaData);
            } else {
                copy.add(metaData);
            }
            return Array.from(copy);
        })
    };

    
    return <div
        className={cn("relative flex items-center justify-center overflow-hidden cursor-pointer", className)}
        onClick={handleSelect}
    >
        {/* Loading spinner */}
        {isLoading && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700" />
        )}

        {/* Error placeholder */}
        {(isError || !src) && ( 
            <div className="flex flex-col items-center justify-center text-center text-sm text-gray-500">
                <Placeholder type={type} />
            </div>
        )}

        {/* Real image */}
        {!isError &&
            <Image
            src={getOptimizedImage(src, 1200)}
            alt={alt}
            fill
            // placeholder="blur"
                // blurDataURL={getOptimizedImage(src, 10)}
                loading="lazy"
                unoptimized
                onLoad={handleLoad}
                onError={handleError}
                className={cn(
                    "transition-opacity duration-500", imageObjectCover,
                    isLoading ? "opacity-0" : "opacity-100", "hover:opacity-80 transition"
                )}
        />
        }

        {/* Selected overflow layer */}
        {
            selected?.includes(metaData!) && (
                <div className="absolute inset-0 bg-blue-500/30 flex items-center justify-center text-white font-bold">
                    ✓
                </div>
            )
        }

        {/*Remove/delete button */}
        {
            !selected?.includes(metaData!) &&
            useRemove &&
            remove &&
            <button
                type="button"
                className="text-base p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 absolute top-1 right-1 cursor-pointer"
                onClick={(e) => {
                        const sendOut = metaData || src
                        remove(sendOut)
                        e.stopPropagation();
                    }}
                >
                    <Trash2 className="w-3 h-3" />
            </button>
        }
    </div >;
};


const Placeholder = ({ type }: { type: "Profile" | "Property" }) => {

    if (type === "Profile") return <User className="w-full h-full text-gray-400" />;
    return <ImageIcon className="w-full h-full text-gray-400" />;
};

export default DisplayImage;
