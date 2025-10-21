"use client";

import { useState, useCallback, useEffect } from "react";
import Cropper, { Area } from "react-easy-crop";
//import { Area } from "react-easy-crop/types";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import useLockScroll from "@/hooks/useLockScroll";

interface ImageCropModalProps {
    open: boolean;
    imageSrc: string | null;
    onClose: () => void;
    onCropComplete: (croppedBlob: Blob | null) => void;
    outputType?: string;
    aspect?: number;
}

export default function PhotoEditor({
    open,
    imageSrc,
    onClose,
    onCropComplete,
    outputType = "image/png",
    aspect = 1,
}: ImageCropModalProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);


    useLockScroll({ open });

    const onCropCompleteInternal = useCallback((_: Area, croppedPixels: Area) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous"; // important for Cloudinary blobs
            img.src = url;
            img.onload = () => resolve(img);
            img.onerror = (e) => reject(e);
        });

    const handleSave = async () => {
        if (!croppedAreaPixels || !imageSrc) return;
        try {
            const image = await createImage(imageSrc);
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const { width, height } = croppedAreaPixels;
            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(
                image,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                width,
                height,
                0,
                0,
                width,
                height
            );

            canvas.toBlob(
                (blob) => {
                    onCropComplete(blob);
                    onClose();
                },
                outputType,
                0.95
            );
        } catch (err) {
            console.error("Crop error:", err);
            onCropComplete(null);
            onClose();
        }
    };

    const handleReset = () => {
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
    };

    // Auto-set initial crop area and zoom when image loads
    useEffect(() => {
        if (!imageSrc || !open) return;

        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            const aspectRatio = img.width / img.height;

            // Center crop
            setCrop({ x: 0, y: 0 });

            // Auto-zoom so the preview roughly fits your 96x96 profile display
            if (aspectRatio > 1) {
                // Wider image
                setZoom(img.width / 400);
            } else {
                // Taller image
                setZoom(img.height / 400);
            }
        };
        setRotation(0);
    }, [imageSrc, open]);


    return (
        <AnimatePresence>
            {open && imageSrc && (
                <motion.div
                    key="crop-modal"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        transition={{ type: "spring", stiffness: 200, damping: 18 }}
                        className="text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 rounded-2xl w-full max-w-lg p-4 shadow-2xl"
                    >
                        <h2 className="text-lg font-semibold mb-2">Crop Profile Picture</h2>
                        <div className="relative w-full h-72 sm:h-96 rounded-xl overflow-hidden">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={aspect}
                                rotation={rotation}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onRotationChange={setRotation}
                                onCropComplete={onCropCompleteInternal}
                                restrictPosition={false}
                                cropShape="round"
                                showGrid={false}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                            <div className="flex items-center gap-2 w-full">
                                <label className="text-sm opacity-70">Zoom</label>
                                <input
                                    type="range"
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    value={zoom}
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="w-full accent-red-700"
                                />
                            </div>
                            <div className="flex items-center gap-3 w-full text-sm sm:w-auto justify-end">
                                <Button variant="ghost" className="cursor-pointer" onClick={handleReset}>
                                    Reset
                                </Button>
                                <Button variant="ghost" className="cursor-pointer" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-red-700 hover:bg-red-800 text-white cursor-pointer"
                                    onClick={handleSave}
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
