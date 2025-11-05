import { NextResponse } from "next/server";

export async function GET() {
    const response = NextResponse.json({ success: true, message: "Logout successfully!" });
    response.cookies.delete("auth_token");
    return response;
}
