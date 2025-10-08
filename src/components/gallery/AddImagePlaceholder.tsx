import { ImagePlus } from "lucide-react";

export default function ImageUploadBox({ onClick }: { onClick: () => void }) {
    return (
        <div
            className="
        w-[160px] h-[160px] 
        flex flex-col items-center justify-center
        border-2 border-dashed rounded-lg
        text-gray-400 hover:text-gray-600
        hover:border-gray-400
        cursor-pointer transition
        bg-gray-50 hover:bg-gray-100
      "
            onClick={onClick}
        >
            <ImagePlus className="w-8 h-8 mb-2" />
            <span className="text-xs font-medium">Add Image</span>
        </div>
    )
}
