"use client";

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dispatch, SetStateAction, useRef, useState, useEffect } from "react";
import ImageUploadBox from "./AddImagePlaceholder";
import UploadImage from "./UploadImage";
import DisplayImage from "./DisplayImage";
import { ArrowLeft, Loader2 } from "lucide-react";
import EmptyGallery from "./EmptyGallery";
import { uploadImage } from "@/lib/cloudinary/services";
import { showError, showSuccess } from "../Toasts";
import { addImage } from "@/lib/firebase/image_service";
import ImageTypes from "@/types/image.types";


type Props = {
    galleryImages: string[],
    setGalleryImages: Dispatch<SetStateAction<string[]>>,
    setGetSelected: (s: string[]) => void
};

const MAX_SIZE_MB = 5;

export default function ImageGallery({ galleryImages, setGalleryImages, setGetSelected }: Props) {
    const router = useRouter()
    const [open, setOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [selected, setSelected] = useState<string[]>([]);
    const [loading, setLoading] = useState({ isLoading: true, loading: 0 });
    const galleryEleRef = useRef<HTMLDivElement>(null);


    const handleCloseModal = (v: boolean) => {
        if (v) {
            window.history.pushState({ modal: true }, "") // Add modal to the nav history            
            setOpen(true) // Open modal
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
                    }).map((img) => uploadImage(img))
            );

            setGalleryImages((p) => ([...p, ...uploadsImages.map(img => img.url)]));
            showSuccess("Property submitted!", "Image Uploaded!")

            // Save image metaData to fire store 
            await Promise.all(uploadsImages.map((img) => addImage({ ...img, uploader: "amin" })));

        } catch (err) {
            const errorMsg = err as { message: string };
            console.error(err)
            showError("Failed to submit", errorMsg.message);
        } finally {
            setLoading({ isLoading: false, loading: 0 });
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        handleUpload(e.dataTransfer.files);
    };

    // ESC key closes
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && open) {
                setOpen(false)
            }
        }

        // Disable body scroll when open
        if (open) {
            document.body.classList.add("overflow-hidden")
        } else {
            document.body.classList.remove("overflow-hidden")
        }

        window.addEventListener("keydown", onKey)
        return () => {
            document.body.classList.remove("overflow-hidden")
            window.removeEventListener("keydown", onKey);
        }
    }, [open])


    useEffect(() => {

        const handlePopState = (event: PopStateEvent) => {
            //console.log(event.state?.modal);            
            setSelected([]); // Cleen seleted
            setOpen(false); // Close the modal                            
        };

        window.addEventListener("popstate", handlePopState);


        return () => {
            window.removeEventListener("popstate", handlePopState);
            //remove extra state when modal closes
            // if (window.history.state?.modal) {
            //     router.back();
            // }
        };
    }, [])


    if (!open) {
        return <ImageUploadBox onClick={() => handleCloseModal(true)} />
    }

    {/* Backdrop */ }
    return (<div
        className="fixed inset-0 z-50 bg-black/50" onClick={() => handleCloseModal(true)}>
        {/* Fullscreen overlay */}
        <div
            className="w-full h-full flex flex-col bg-white animate-in fade-in-50 slide-in-from-bottom-10"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center shadow">
                <button
                    type="button"
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 cursor-pointer"
                    onClick={() => handleCloseModal(false)}
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="flex-1 flex flex-col items-center">
                    <h2 className="text-lg font-semibold">Image Gallery</h2>
                    <p className="text-sm text-muted-foreground">Select images to add to your property</p>
                </div>
            </div>

            {/* Upload section */}
            <div className="flex justify-center items-center p-4">
                <UploadImage
                    multiple
                    accept="image/*"
                    inputRef={inputRef}
                    onDrop={handleDrop}
                    handleUpload={(e) => handleUpload(e.target.files)} />
            </div>

            {/* Grid */}
            {galleryImages.length ?
                <div
                    ref={galleryEleRef}
                    className="flex-1 max-h-full p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 overflow-x-hidden overflow-y-auto"
                >
                    {galleryImages.map(url => (
                        <DisplayImage
                            key={url}
                            src={url}
                            selected={selected}
                            setSelected={setSelected}
                            handleremove={false}
                            className="h-[180px] sm:h-[280px]"
                        />
                    ))}
                    {
                        loading.isLoading ?
                            Array(loading.loading)
                                .fill("")
                                .map((_, i) =>
                                    <div
                                        key={`loading-${i}`}
                                        className="h-[180px] sm:h-[280px] flex items-center justify-center bg-gray-100 rounded-lg animate-pulse"
                                    >
                                        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                                    </div>
                                )
                            :
                            null
                    }
                </div> :
                <EmptyGallery inputRef={inputRef} />
            }

            {/* Footer */}
            <div className="p-4 border-t flex justify-center gap-4 shadow">
                {selected?.length ? <Button
                    type="button"
                    className="bg-green-800 hover:bg-green-600 hover:text-gray-800 font-medium shadow cursor-pointer"
                    disabled={selected.length === 0}
                    onClick={() => {
                        setGetSelected(selected);
                        handleCloseModal(false);
                    }}

                >
                    Add Selected Images
                </Button>
                    : null
                }
            </div>
        </div>
    </div>
    );
};
