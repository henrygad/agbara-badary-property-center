"use client";

import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { Trash2 } from "lucide-react";
import ImageTypes from "@/types/image.types";

type Props = {
    src: string,
    alt?: string
    className?: string,
    metaData?: ImageTypes,
    selected?: ImageTypes[],
    setSelected?: Dispatch<SetStateAction<ImageTypes[]>>
    remove?: (i: string) => void
    handleremove?: boolean
};

const DisplayImage = ({ src, alt = "demo", metaData, selected, setSelected = () => { }, remove = () => null, handleremove, className }: Props) => {

    // advance feature are, display full image, and able to edit image size (crop)
    return <div
        className={`relative overflow-hidden cursor-pointer ${selected?.includes(metaData!)
            ? "border-blue-500"
            : "border-transparent"
            } ${className || ""}`}
        onClick={() =>
            setSelected(pre => {
                const copy = new Set(pre);
                if (copy.has(metaData!)) {
                    copy.delete(metaData!);
                } else {
                    copy.add(metaData!);
                }
                return Array.from(copy);
            })
        }
    >
        <Image
            src={src}
            alt={alt}
            fill
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2U1ZTVlNSIgLz4="
            sizes="100%"
            className="w-full h-auto object-cover"
        />
        {selected?.includes(metaData!) && (
            <div className="absolute inset-0 bg-blue-500/30 flex items-center justify-center text-white font-bold">
                ✓
            </div>
        )}

        {handleremove && <button
            type="button"
            className="text-base p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 absolute top-1 right-1 cursor-pointer"
            onClick={(e) => {
                remove(src)
                e.stopPropagation();
            }}
        >
            <Trash2 className="w-3 h-3" />
        </button>}
    </div>;
};

export default DisplayImage;
