import { NextRequest, NextResponse } from "next/server";
import { getCookieFromClient } from "@/utils";
import RequestTypes from "@/types/request.types";
import { addNewRequestDb } from "@/lib/firebase/request_service";
import { render } from "@react-email/components";
import { PropertyRequestEmail } from "../../../../../emails/PropertyRequestEmail";
import { mailOptions, transporter } from "@/lib/nodemailer/config";
import { AdminNotification } from "../../../../../emails/AdminNotification";
import NotificationTypes from "@/types/notification.types";
import { addNotificationDb } from "@/lib/firebase/notification._service";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { propertyId, referenceId, propertyTitle, name, email, phone, message } = body;

    // Reject incomplate data
    if (!propertyId || !referenceId || !name || !email || !phone || !message || !propertyTitle) {
        return NextResponse.json({ success: false, message: "Incomplate data" }, { status: 400 });
    }

    // read cookie (HttpOnly cookie)    
    const clientId = getCookieFromClient(req);

    if (!clientId) {
        return NextResponse.json({ success: false, message: "Client id missing" }, { status: 400 });
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

    const response = await addNewRequestDb(payLoad);

    if (response === "Exists") {
        return NextResponse.json({ response, success: false, message: "Try again later" }, { status: 405 });
    }

    // Send an auto response email to client
    const responseHtml = await render(PropertyRequestEmail({ name, propertyTitle, referenceId }));
    await transporter.sendMail({
        ...mailOptions,
        to: email,
        subject: `Your Request for ${propertyTitle}`,
        html: responseHtml,
    });

    // Create a new admin notification 
    const notify: NotificationTypes = {
        to: "admin",
        title: `New Property Request: ${propertyTitle}`,
        message: `${name} just requested information about ${propertyTitle}.`,
        createdAt: new Date(),
        viewed: false,
        type: "Request"
    };

    await addNotificationDb(notify);

    // Send notifaction email to admin
    const adminHtml = await render(AdminNotification({
        subject: "New Property Request Received<",
        message: `${name} just requested information about ${propertyTitle}.`,
        name,
        phone,
        email,
        propertyTitle,
        referenceId
    }));

    await transporter.sendMail({
        ...mailOptions,
        to: process.env.NEXT_PUBLIC_GMAIL,
        subject: `New Property Request: ${propertyTitle}`,
        html: adminHtml,
    });

    return NextResponse.json({ success: true, message: "Request sent successfully", response }, { status: 201 });
};

