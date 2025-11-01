import React from "react";
import { NextResponse } from "next/server";
import { transporter, mailOptions } from "@/lib/nodemailer/config";
import { render } from "@react-email/render";
import { ContactReplyEmail } from "@/../emails/ContactReplyEmail";
import { AdminNotification } from "@/../emails/AdminNotification";
import ContactTypes from "@/types/contact.tyes";
import { addNotificationDb } from "@/lib/firebase/notification._service";
import NotificationTypes from "@/types/notification.types";

export async function POST(req: Request) {
    ;

    const body: ContactTypes = await req.json() as ContactTypes;
    const { name, phone, email, subject, message } = body;

    try {

        // Send reply email to client
        const userHtml = await render(React.createElement(ContactReplyEmail, { name }));        

        await transporter.sendMail({
            ...mailOptions,
            to: email, // send to client
            subject: `Reply from Agbara Badagry Property Center – ${subject}`,
            html: userHtml,
        });

        // send a copy to admin
        const adminHtml = await render(
            React.createElement(AdminNotification, {
                subject,
                message,
                name,
                email,
                phone,
            })
        );

        await transporter.sendMail({
            ...mailOptions,
            to: process.env.NEXT_PUBLIC_GMAIL,
            subject: `New contact from ${name}`,
            text: `${name} (${email}) (${phone}) sent you a message:\n\n${message}`,
            html: adminHtml,
        });

        // Create admin notification
        const notify: NotificationTypes = {
            to: "admin",
            title: "New Contact Message",
            message: `${name} just contacted you via the website.`,
            createdAt: new Date(),
            viewed: false,
            type: "Contact"
        };
        await addNotificationDb(notify);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
    }
};

