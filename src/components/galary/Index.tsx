"use client";
import { ImageType } from "@/types/image.type";
import DisplayImage from "./DisplayImage";
import InputImage from "./InputImage";
import { Dispatch, SetStateAction, useRef, useState } from "react";
// import Modal from "../Modal";

type Props = { imageGalary: string[], setImageGalary: Dispatch<SetStateAction<string[]>>, selects: string[], setSelects: Dispatch<SetStateAction<string[]>> };

export default function Galary({ imageGalary, setImageGalary, selects, setSelects }: Props) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState(false);

    const onFiles = (files: FileList | null) => {
        if (!files) return;        
        const arr = Array.from(files).map(
            (f) => ({ file: f, url: URL.createObjectURL(f) } as ImageType)
        );

        arr.forEach(i => {
            uploadToCloudinary(i);
        });
    };

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        onFiles(e.dataTransfer.files);
    };

    async function uploadToCloudinary(image: ImageType) {
        setImageGalary((pre) => ([...pre].concat([image.url])) );
        // Example: use unsigned preset
        // const url = `https://api.cloudinary.com/v1_1/<CLOUD_NAME>/upload`;
        // const formData = new FormData();
        // formData.append('file', file);
        // formData.append('upload_preset', '<UPLOAD_PRESET>');
        // const res = await fetch(url, { method: 'POST', body: formData });
        // const data = await res.json();
        // return data.secure_url;
        // return "https://via.placeholder.com/600x400?text=Uploaded+Image";
    }

    return <div className="flex flex-col w-full gap-10">
        <div className="flex flex-wrap justify-start gap-4">
            {
                imageGalary?.length ?
                    imageGalary.map((i) =>
                        <DisplayImage
                            className="w-[180px] h-[180px]"
                            key={i}
                            img={i}
                            selects={selects}
                            setSelects={setSelects}
                        />
                    ) :
                    null
            }
        </div>
        <div className="flex-1 flex justify-center items-center">
            <InputImage
                multiple={true}
                accept="image/*"
                onFiles={onFiles}
                onDrop={onDrop}
                inputRef={inputRef}
            />
        </div>

        {/* <Modal isOpen setIsOpen={setUploadImageModal}>
            <div></div>
        </Modal> */}
    </div>;
};
