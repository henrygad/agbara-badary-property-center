import Image from "next/image";
import { Dispatch, SetStateAction} from "react";

type Props = {
    className?: string,
    img: string,
    selects?: string[]
    setSelects?: Dispatch<SetStateAction<string[]>>,
    remove?: (i: string) => void
};

const DisplayImage = ({ img, selects, setSelects = () => { }, remove = () => null, className }: Props) => {
    return <div
        className={`relative flex rounded-lg overflow-hidden shadow cursor-pointer
        ${selects?.includes(img) ? "ring-2 ring-blue-600" : ""} ${className}`}
        onClick={_ =>
            setSelects(pre => { 
                if (pre.includes(img)) {
                    return pre.filter(fi => fi !== img);
                }
                return [...pre, img];
            })
        }
    >
        <Image
            src={img}
            alt={img}
            fill
            className="w-full h-auto object-cover rounded-lg"
        />
        {!selects && <button
            type="button"
            className="text-base font-bold text-red-800 absolute to-1 right-1 cursor-pointer"
            onClick={(e) => {
                remove(img)
                e.stopPropagation();
            }}
        >
            X
        </button>}
    </div>;
};

export default DisplayImage;
