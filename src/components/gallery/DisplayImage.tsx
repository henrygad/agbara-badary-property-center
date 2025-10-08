"use client";

import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { Trash2 } from "lucide-react";

type Props = {
    src: string,
    alt?: string
    className?: string,
    selected?: string[],
    setSelected?: Dispatch<SetStateAction<string[]>>
    remove?: (i: string) => void
    handleremove?: boolean
};

const DisplayImage = ({ src, alt = "demo", selected, setSelected = () => { }, remove = () => null, handleremove, className }: Props) => {

    // advance feature are, display full image, and able to edit image size (crop)
    return <div
        className={`relative rounded-lg overflow-hidden border-2 cursor-pointer shadow ${selected?.includes(src)
            ? "border-blue-500"
            : "border-transparent"
            } ${className || ""}`}
        onClick={_ =>
            setSelected(pre => {
                const copy = new Set(pre);
                if (copy.has(src)) {
                    copy.delete(src);
                } else {
                    copy.add(src);
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
            className="w-full h-auto object-cover rounded-lg"
        />
        {selected?.includes(src) && (
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
