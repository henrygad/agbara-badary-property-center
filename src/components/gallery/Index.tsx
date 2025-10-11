"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import ImageUploadBox from "./AddImagePlaceholder";
import UploadImage from "./UploadImage";
import DisplayImage from "./DisplayImage";
import { ArrowLeft, Loader2 } from "lucide-react";
import EmptyGallery from "./EmptyGallery";
import { uploadImage } from "@/lib/cloudinary/services";
import { showError, showSuccess } from "../Toasts";
import ImageTypes from "@/types/image.types";
import { addImageDb } from "@/lib/firebase/image_service";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import useLockScroll from "@/hooks/useLockScroll";
import CustomButton from "../CustomButton";

type Props = {
    galleryImages: ImageTypes[];
    setGalleryImages: (img: ImageTypes[]) => void;
    setGetSelected: (img: ImageTypes[]) => void;
};

const MAX_SIZE_MB = 5;

export default function ImageGallery({
    galleryImages,
    setGalleryImages,
    setGetSelected,
}: Props) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [selected, setSelected] = useState<ImageTypes[]>([]);
    const [loading, setLoading] = useState({ isLoading: true, loading: 0 });
    const galleryEleRef = useRef<HTMLDivElement>(null);

    const handleCloseModal = (v: boolean) => {
        if (v) {
            // Add modal to the nav history
            //window.history.pushState({ modal: true }, "", window.location.href + "#");
            window.history.pushState({ modal: true }, "");
            setOpen(true); // Open modal
        } else {
            setSelected([]); // Cleen seleted
            router.back(); // Clean up history
            setOpen(false); // Close the modal
        }
    };

    const handleUpload = async (files: FileList | null) => {
        if (!files) return;
        const arrOfImageFiles = Array.from(files);

        setLoading({ isLoading: true, loading: arrOfImageFiles.length });

        const clearnOut = setTimeout(() => {
            if (galleryEleRef.current) {
                // Auto scroll down to the element total height
                galleryEleRef.current.scrollTop = galleryEleRef.current.scrollHeight;
            }
            clearTimeout(clearnOut);
        }, 100);

        try {
            const uploadsImages = await Promise.all(
                arrOfImageFiles
                    .filter((img) => {
                        if (img.size > MAX_SIZE_MB * 1024 * 1024) {
                            showError("Failed to submit", "Image size must be 5 MB or less.");
                            return false;
                        }

                        return true;
                    })
                    .map((img) => uploadImage(img))
            );

            const imageMetaData = uploadsImages.map((img) => ({
                ...img,
                uploader: "admin",
            }));

            setGalleryImages(imageMetaData);
            showSuccess("Property submitted!", "Image Uploaded!");

            // Save image metaData to fire store
            await Promise.all(imageMetaData.map((img) => addImageDb(img)));
        } catch (err) {
            const errorMsg = err as { message: string };
            console.error(err);
            showError("Failed to submit", errorMsg.message);
        } finally {
            setLoading({ isLoading: false, loading: 0 });
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        handleUpload(e.dataTransfer.files);
    };

    // Disable page from scrolling
    useLockScroll({ open });

    // ESC key closes
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && open) {
                setOpen(false);
            }
        };

        window.addEventListener("keydown", onKey);
        return () => {
            window.removeEventListener("keydown", onKey);
        };
    }, [open]);

    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            event.preventDefault();
            //console.log(event.state?.modal);
            setSelected([]); // Cleen seleted
            setOpen(false); // Close the modal
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
            // remove extra state when modal closes
            if (window.history.state?.modal) {
                router.back();
            }
        };
    }, [router]);

    if (!open) {
        return <ImageUploadBox onClick={() => handleCloseModal(true)} />;
    }

    {
        /* Backdrop */
    }
    return (
        <div
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => handleCloseModal(true)}
        >
            {/* Fullscreen overlay */}
            <div
                className="h-full max-h-full relative text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 animate-in fade-in-50 slide-in-from-bottom-10"
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="absolute top-0 right-0 left-0 h-20 px-4 border-b flex justify-between items-center shadow z-50 bg-inherit">
                    <button
                        type="button"
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 cursor-pointer"
                        onClick={() => handleCloseModal(false)}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div className="flex-1 flex flex-col items-center">
                        <h2 className="text-lg font-semibold">Image Gallery</h2>
                        <p className="text-sm text-gray-700 dark:text-white ">
                            Select images to add to your property
                        </p>
                    </div>
                </div>
                {/* content */}
                <ScrollArea className="overflow-auto h-full max-h-full pt-20">
                    {/* Upload section */}
                    <div className="flex justify-center items-center p-4">
                        <UploadImage
                            multiple
                            accept="image/*"
                            inputRef={inputRef}
                            onDrop={handleDrop}
                            handleUpload={(e) => handleUpload(e.target.files)}
                        />
                    </div>

                    {/* Grid */}
                    {galleryImages.length ? (
                        <div
                            ref={galleryEleRef}
                            className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 pb-10"
                        >
                            {galleryImages.map((img, idx) => (
                                <DisplayImage
                                    key={idx}
                                    src={img.url}
                                    metaData={img}
                                    selected={selected}
                                    setSelected={setSelected}
                                    handleremove={false}
                                    className="h-[180px] sm:h-[280px] rounded border shadow"
                                />
                            ))}
                            {loading.isLoading
                                ? Array(loading.loading)
                                    .fill("")
                                    .map((_, i) => (
                                        <div
                                            key={`loading-${i}`}
                                            className="h-[180px] sm:h-[280px] flex items-center justify-center bg-gray-100 rounded-lg animate-pulse"
                                        >
                                            <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                                        </div>
                                    ))
                                : null}
                        </div>
                    ) : (
                        <EmptyGallery inputRef={inputRef} />
                    )}
                    <ScrollBar orientation="vertical" />
                </ScrollArea>
                {/* Footer */}
                {selected?.length ? (
                    <div className="absolute bottom-0 right-0 left-0 h-20 shadow flex justify-center items-center">
                        <CustomButton                                                 
                            disabled={selected.length === 0}
                            onClick={() => {
                                setGetSelected(selected);
                                handleCloseModal(false);
                            }}
                        >
                           <> Add Selected Images</>
                        </CustomButton>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
