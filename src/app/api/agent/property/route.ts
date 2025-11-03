
import { mailOptions, transporter } from "@/lib/nodemailer/config";
import { validateEmail } from "@/utils";
import { render } from "@react-email/components";
import { NextResponse } from "next/server";
import NotificationTypes from "@/types/notification.types";
import { addNotificationDb } from "@/lib/firebase/notification._service";
import { AgentProperty } from "../../../../../emails/AgentProperty";
import { PropertyTypes } from "@/types/property.types";

export async function POST(req: Request) {

    try {

        const body = (await req.json()) as {
            email: string,
            name: string,
            title: string,
            refId: string,
            id: string,
            availability: PropertyTypes["availability"]

        };
        const { email, name, title,  refId, availability , id} = body;

        // Validate incoming requests
        if (!email || !name || !refId || !availability || !title || !id) {
            return NextResponse.json(
                { success: false, message: "Incomplate data!" },
                { status: 400 }
            );
        }

        // Validaet email
        if (!validateEmail(email)) {
            return NextResponse.json(
                { success: false, message: "Invalid email!" },
                { status: 400 }
            );
        }

        // Send a email account status to agent
        const accountHtml = await render(AgentProperty({ name, availability, title, refId }));
        await transporter.sendMail({
            ...mailOptions,
            to: email,
            subject: `Property status - ${availability}`,
            html: accountHtml,
        });

        // Create new notification        
        const notify: NotificationTypes = {
            to: id,
            title: `Property status - ${availability}`,
            message: `Your property has been ${availability}.`,
            type: "Property",
            viewed: false,
            createdAt: new Date(),
        }
        
        await addNotificationDb(notify);

        return NextResponse.json({
            success: true,
            message: "Property status successfully updated!",
        });


    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Failed update property status." },
            { status: 500 }
        );
    }
};