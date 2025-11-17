"use client";

import { useRef, useState, useEffect } from "react";
import AddImagePlaceholder from "./AddImagePlaceholder";
import UploadImage from "./UploadImage";
import DisplayImage from "./DisplayImage";
import { ArrowLeft, Trash2 } from "lucide-react";
import EmptyGallery from "./EmptyGallery";
import { uploadImageToCloud } from "@/lib/cloudinary/services";
import { showError, showSuccess } from "../ui/toasts";
import ImageTypes from "@/types/image.types";
import { addImageDb, deleteImageDb } from "@/lib/firebase/image_service";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import CustomButton from "../CustomButton";
import Modal from "../Modal";
import { useModal } from "@/hooks/useModal";
import { useImageStore } from "@/store/useImageStore";
import { Button } from "../ui/button";

import {
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "../ui/drawer";
import { useUserStore } from "@/store/useUserStore";
import ImageLoader from "../loaders/ImageLoader";

type Props = {
    setGetSelected: (img: ImageTypes[]) => void;
};

const MAX_SIZE_MB = 5;

export default function Gallery({ setGetSelected }: Props) {
    const { user } = useUserStore();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [selected, setSelected] = useState<ImageTypes[]>([]);
    const [loading, setLoading] = useState({ isLoading: false, loading: 0 });
    const { open, handleModal } = useModal();

    const { images, addImage, deleteImage } = useImageStore();

    const handleUpload = async (files: FileList | null) => {
        if (!files || !user) return;

        const arrOfImageFiles = Array.from(files);

        setLoading({ isLoading: true, loading: arrOfImageFiles.length });

        try {
            const uploadsImages = await Promise.all(
                arrOfImageFiles
                    .filter((img) => {
                        if (img.size > MAX_SIZE_MB * (1024 * 1024)) {
                            // showError("Failed to submit", "Image size must be 5 MB or less.");
                            throw new Error(
                                `Failed to submit", "Image size must be 5 MB or less`
                            );
                        }

                        return true;
                    })
                    .map((img) => uploadImageToCloud(img))
            );

            let getImageMetaData = uploadsImages.map((img) => ({
                ...img,
                uploader: user.id!,
            }));

            getImageMetaData = await Promise.all(
                getImageMetaData.map((img) => addImageDb(img))
            );

            getImageMetaData.forEach((imageMeta) => {
                addImage(imageMeta);
            });

            showSuccess("Image Uploaded!");
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

    const handleDeleteImageMetaDeta = async (
        imageMetaData: ImageTypes | string
    ) => {
        if (typeof imageMetaData !== "object") return;
        deleteImage(imageMetaData.id!);

        try {
            await deleteImageDb(imageMetaData.id!);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteAllSelectedImages = () => {
        selected.forEach((img) => {
            setSelected((pre) => pre.filter((fimg) => fimg.id !== img.id));
            handleDeleteImageMetaDeta(img);
        });
    };

    const handleSelectAllImages = () => {
        // Unselect, if all images have been selected
        if (selected.length === images.length) {
            setSelected([]);
            return;
        }
        // Else, select all
        setSelected([]);

        // Then add all images
        setSelected(images);
    };

    // Change on popstate
    useEffect(() => {
        if (!open) {
            setSelected([]); // Cleen seleted
        }
    }, [open]);

    if (!open) {
        return <AddImagePlaceholder onClick={() => handleModal(true)} />;
    }

    return (
        <Modal
            open
            setOpen={handleModal}
            className="fixed inset-0 h-screen w-screen max-w-none"
        >
            <DrawerHeader className="relative flex justify-between items-center">
                <div className="absolute left-2 top-0">
                    <Button
                        type="button"
                        variant="ghost"
                        datatype="icon"
                        className="rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 cursor-pointer"
                        onClick={() => handleModal(false)}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </div>
                <DrawerTitle>Image Gallery</DrawerTitle>
                <DrawerDescription>
                    Select images to add to your property
                </DrawerDescription>
            </DrawerHeader>

            {/* content */}
            <ScrollArea className="max-h-full overflow-auto">
                <div className="p-2 space-y-2">

                    {/* Upload section */}
                    <div className="flex justify-center items-center">
                        <UploadImage
                            multiple={true}
                            accept="image/*"
                            inputRef={inputRef}
                            onDrop={handleDrop}
                            handleUpload={(e) => handleUpload(e.target.files)}
                        />
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        <>
                            {loading.isLoading
                                ? Array(loading.loading)
                                    .fill("")
                                    .map((_, i) => (
                                        <ImageLoader
                                            key={`loading-${i}`}
                                            className="w-auto h-30 sm:h-[280px] shrink-0 rounded-xl"
                                        />
                                    ))
                                : null}

                            {images.length
                                ? images.map((img, idx) => (
                                    <DisplayImage
                                        key={idx}
                                        src={img.url}
                                        metaData={img}
                                        selected={selected}
                                        setSelected={setSelected}
                                        remove={handleDeleteImageMetaDeta}
                                        className="w-auto h-30 sm:h-[280px] shrink-0 rounded-xl items-start cursor-pointer"
                                    />
                                ))
                                : !loading.isLoading && (
                                    <div className="col-span-4">
                                        <EmptyGallery inputRef={inputRef} />
                                    </div>
                                )}
                        </>
                    </div>

                </div>
                <ScrollBar orientation="vertical" />
            </ScrollArea>            

            {/* Footer */}
            {images.length ? 
                <DrawerFooter className="w-full">
                    <div className="flex justify-between items-center">
                        <div>
                            <Button
                                disabled={selected.length === 0}
                                type="button"
                                variant="ghost"
                                datatype="icon"
                                className="text-green-400 text-sm font-medium cursor-pointer w-16"
                                onClick={handleSelectAllImages}
                            >
                                {selected.length === images.length ? "Unselect" : "Select"}
                            </Button>
                        </div>
                        <div className="flex-1 flex justify-center px-8 md:px-10">
                            <CustomButton
                            disabled={selected.length === 0}
                            onClick={() => {
                                setGetSelected(selected);
                                setSelected([]);
                                handleModal(false);
                            }}
                        >
                                <> Add</>
                            </CustomButton>
                        </div>
                        <div>
                            <Button
                                disabled={selected.length === 0}
                                type="button"
                                variant="ghost"
                            size="icon"
                                className="text-red-400 text-sm font-medium cursor-pointer"
                                onClick={handleDeleteAllSelectedImages}
                            >
                            <Trash2 size={60} />
                            </Button>
                        </div>
                    </div>
                </DrawerFooter> :
                null}
        </Modal>
    );
}
