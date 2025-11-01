import { getCookieFromClient } from "@/utils";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {  
    const DNS = process.env.NEXT_PUBLIC_APP_DSN || "agbarabadagrypropertycenter.com";
    const existing =  getCookieFromClient(req);

    const res = NextResponse.json({ success: true, message: "Welcome client!" });

    if (existing) {
        // cookie exists — nothing to do
        return res;
    }

    const clientId = uuidv4();    

    // cookie options:
    // __Host- prefix recommended if setting from root and using Secure + Path="/"
    // but Next's cookies.set will handle options below
    res.cookies.set({
        name: `__Host-${DNS}_client_id`, // __Host- forces Secure + Path=/ and no Domain
        value: clientId,
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",       // required for __Host-; next will accept it
        maxAge: (60 * 60 * 24 * 365), // 1 year in seconds
    });

    return res;
}
