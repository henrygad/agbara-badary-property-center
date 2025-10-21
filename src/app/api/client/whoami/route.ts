
import { getCookieFromClient } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
    const clientId = getCookieFromClient(req);
    return NextResponse.json({ clientId });
}
