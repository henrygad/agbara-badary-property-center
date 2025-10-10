 import { NextResponse } from "next/server"
// import cloudinary from "@/lib/cloudinary/config"


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
