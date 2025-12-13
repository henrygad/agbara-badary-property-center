import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./utils";


export async function middleware(req: NextRequest) {
    const isDisable = true;

    if (isDisable) {
        return new NextResponse(
            "🚧 Agbara Badagry Property Center is down. We'll be back soon.",
            { status: 503 }
        );
    }
    const { pathname } = req.nextUrl;
    const token = req.cookies.get("auth_token")?.value;
    const url = req.nextUrl.clone();

    // Auth routes (login/register)
    const authRoutes = ["/auth/login", "/auth/register", "/auth/forget-password"];

    // Protect these routes
    const agentRoutes = ["/agent"];
    const adminRoutes = ["/admin"];

    // If visiting /auth while already logged in → redirect
    if (token && authRoutes.some((r) => pathname.startsWith(r))) {
        const decoded = await verifyToken(token);
        if (decoded?.accountType === "Agent") {
            url.pathname = "/agent";
            return NextResponse.redirect(url);
        }
        if (decoded?.accountType === "Admin") {
            url.pathname = "/admin";
            return NextResponse.redirect(url);
        }
    }

    // If protected route and no token → redirect to login
    if (
        (agentRoutes.some((r) => pathname.startsWith(r)) ||
            adminRoutes.some((r) => pathname.startsWith(r)) ||
            pathname.startsWith("/auth/verify-email")
        ) &&
        !token
    ) {
        url.pathname = "/auth/login";
        return NextResponse.redirect(url);
    }

    // Verify token if it exists
    if (token) {
        const decoded = await verifyToken(token);

        // Token invalid or expired
        if (!decoded) {
            url.pathname = "/auth/login";
            return NextResponse.redirect(url);
        }

        // Role restrictions
        if (pathname.startsWith("/admin") && decoded.accountType !== "Admin") {
            url.pathname = "/unauthorized";
            return NextResponse.redirect(url);
        }

        if (pathname.startsWith("/agent") && decoded.accountType !== "Agent") {
            url.pathname = "/unauthorized";
            return NextResponse.redirect(url);
        }

        // Pass decoded user info to next response (optional)
        const res = NextResponse.next();
        res.headers.set("x-user-email", decoded.email);
        res.headers.set("x-user-role", decoded.accountType);
        return res;
    }

    // Default: continue as normal
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/:path*",
        "/agent/:path*",
        "/admin/:path*",
        "/auth/:path*", 
        "/api/agent/:path*",
        "/api/admin/:path*",
    ],
};
