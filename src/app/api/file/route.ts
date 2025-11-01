import { NextResponse } from "next/server";

export async function GET() {

    try {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
        const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!;
        const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET!;
        const folder = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER;    

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


export async function POST() {
    try {

        // Generate a signed upload preset
        const timestamp = Math.round(new Date().getTime() / 1000)
        const folder = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "properties"

        const signature = ""; /* cloudinary.utils.api_sign_request(
            { timestamp, folder },
            process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY as string
        ) */

        return NextResponse.json({
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
            timestamp,
            signature,
            folder,
        })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to generate signature" }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        const { public_ids } = await req.json(); // array of public IDs to delete

        if (!Array.isArray(public_ids) || public_ids.length === 0) {
            return NextResponse.json({ error: "No public IDs provided" }, { status: 400 });
        }

        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
        const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!;
        const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET!;

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Basic " + Buffer.from(`${apiKey}:${apiSecret}`).toString("base64"),
                },
                body: JSON.stringify({ public_ids }),
            }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || "Failed to delete images");

        return NextResponse.json(data);
    } catch (err) {
        const error = err as { message: string };
        console.error("Error deleting images:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
