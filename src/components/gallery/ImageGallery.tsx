"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import DisplayImage from "./DisplayImage";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { useModal } from "@/hooks/useModal";

interface PropertyImageGalleryProps {
    images: string[];
    title?: string;
}

export default function ImageGallery({ images, title }: PropertyImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const { open, handleModal } = useModal();

    return (
        <div className="w-full">

            {/* Thumbnail Scroller */}
            <div className="flex gap-2">
                {images.map((src, i) => (
                    <div
                        key={i}
                        onClick={() => {
                            setSelectedIndex(i);
                            handleModal(true);
                        }}
                        className="h-auto w-auto"
                    >
                        <DisplayImage                           
                            src={src}
                            alt={`${title ?? "Property"} image ${i + 1}`}
                            useRemove={false}                                                        
                            className="w-36 h-28 flex-shrink-0 rounded-xl cursor-pointer"
                        />
                    </div>
                ))}
            </div>

            {/* Framer Motion Modal */}
            <AnimatePresence>
                {open &&
                    selectedIndex !== null && (
                    <motion.div
                        key="overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
                        onClick={() => {
                            setSelectedIndex(null);
                            handleModal(false);
                        }}
                    >
                        {/* Close button */}
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedIndex(null);
                                handleModal(false);
                            }}
                            className="absolute top-4 left-4 text-white hover:text-gray-300 transitionbg-black/90 backdrop-blur-sm rounded-2xl cursor-pointer z-50"
                        >
                            <X size={20} />
                        </button>

                        {/* Prevent click from closing on image */}
                        <motion.div
                            key="image"
                            onClick={(e) => e.stopPropagation()}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="w-full flex items-center justify-center"
                        >
                            {/* Image carousel */}
                            <Carousel
                                opts={{
                                    // align: "start",
                                    // loop: true,
                                    startIndex: selectedIndex,
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="flex w-full h-full relative"
                            >
                                <CarouselContent className="flex">
                                    {images.map((src, i) => (
                                        <CarouselItem
                                            key={i}
                                            className="flex-shrink-0"
                                        >
                                            <DisplayImage
                                                src={src}
                                                alt={`${title ?? "Property"} image`}
                                                useRemove={false}
                                                className="w-screen h-[80vh] select-none"
                                                imageObjectCover="object-contain"
                                            />
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/50 p-2 rounded-full hover:bg-white" />
                                <CarouselNext className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/50 p-2 rounded-full hover:bg-white" />
                            </Carousel>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}