import { NextResponse } from "next/server";

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
