import { NextResponse } from "next/server";

export async function GET() {
    try {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
        const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!;
        const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET!;

        // Folder name that matches your upload_preset target
        const folder = "properties";

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?prefix=${folder}/&max_results=100`,
            {
                headers: {
                    Authorization:
                        "Basic " + Buffer.from(`${apiKey}:${apiSecret}`).toString("base64"),
                },
                cache: "no-store",
            }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || "Failed to fetch images");

        return NextResponse.json(data.resources); // returns an array of image objects
    } catch (err) {
        const error = err as { message: string };

        console.error("Error fetching images:", error);
        return NextResponse.json(
            { error: error.message || "Unknown error" },
            { status: 500 }
        );
    }
};

