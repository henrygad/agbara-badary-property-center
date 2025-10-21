

export async function uploadImageToCloud(file: File) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "properties");

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: "POST",
        body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
        console.error("Cloudinary error:", data);
        throw new Error(data.error?.message || "Upload failed");
    }

    return {
        url: data.secure_url,
        publicId: data.public_id,
        width: data.width,
        height: data.height,
        format: data.format,
    }; 
}

export async function deleteImagesFromCloud(publicIds: string[]) {
    if (!Array.isArray(publicIds) || publicIds.length === 0) {
        throw new Error("No Array of public IDs provided.");
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!;
    const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET!;

    try {
        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Basic " + Buffer.from(`${apiKey}:${apiSecret}`).toString("base64"),
                },
                body: JSON.stringify({ publicIds }),
            }
        );

        const data = await res.json();

        return { data, publicIds };

    } catch (error) {
        console.log(error);
    }
};

