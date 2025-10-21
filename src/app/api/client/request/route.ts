import { NextRequest, NextResponse } from "next/server";
import { getCookieFromClient } from "@/utils";
import RequestTypes from "@/types/request.types";
import { createNewRequestDb } from "@/lib/firebase/request_service";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { propertyId, referenceId, propertyTitle, name, email, phone, message } = body;

    // Reject incomplate data
    if (!propertyId || !referenceId || !name || !email || !phone || !message || !propertyTitle) {
        return NextResponse.json({ error: "Incomplate data" }, { status: 400 });
    }

    // read cookie (HttpOnly cookie)    
    const clientId = getCookieFromClient(req);

    if (!clientId) {
        return NextResponse.json({ error: "Client id missing" }, { status: 400 });
    }

    // query requests in last 24 hours
    const payLoad: RequestTypes = {
        clientId,
        clientName: name,
        clientEmail: email,
        clientPhone: phone,
        message: message,
        propertyId,
        referenceId,
        propertyTitle,
        status: "Pending",
        view: false,
        createdAt: new Date()
    };
    const response = await createNewRequestDb(payLoad);

    if (response === "Exists") {
        return NextResponse.json({ response }, { status: 405 });
    }

    // Send an auto response email to client

    // Create a new admin notification 

    return NextResponse.json({ response }, { status: 201 });
};

