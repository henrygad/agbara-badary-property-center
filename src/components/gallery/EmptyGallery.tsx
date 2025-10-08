import { ImageOff } from "lucide-react";
import { RefObject } from "react";

export default function EmptyGallery({ inputRef}: { inputRef: RefObject<HTMLInputElement | null> }) {
    return (
        <div className="flex-1 flex justify-center items-center">
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
                {/* Empty state icon */}
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                    <ImageOff className="w-8 h-8 text-gray-400" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-700">
                    No Images Yet
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-500 mt-1">
                    You haven’t added any images. Upload images to get started.
                </p>

                {/* Action button */}
                <button
                    type="button"
                    className="mt-4 px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                    onClick={() => inputRef.current?.click()}
                >
                    Upload Image
                </button>
            </div>
        </div>
    );
}
