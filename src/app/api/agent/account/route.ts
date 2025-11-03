
import { mailOptions, transporter } from "@/lib/nodemailer/config";
import { validateEmail } from "@/utils";
import { render } from "@react-email/components";
import { NextResponse } from "next/server";
import UserTypes from "@/types/user.types";
import { AgentAccount } from "../../../../../emails/AgentAccount";
import NotificationTypes from "@/types/notification.types";
import { addNotificationDb } from "@/lib/firebase/notification._service";

export async function POST(req: Request) {

    try {

        const body = (await req.json()) as {
            email: string, firstName: string, lastName: string, id: string,
            status: UserTypes["accountStatus"]

        };
        const { email, firstName, lastName, id, status } = body;

        // Validate incoming requests
        if (!email || !firstName || !lastName || !id || !status) {
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


        const name = `${firstName} ${lastName}`;

        // Send a email account status to agent
        const accountHtml = await render(AgentAccount({ name, status }));
        await transporter.sendMail({
            ...mailOptions,
            to: email,
            subject: `Account status - ${status}`,
            html: accountHtml,
        });

        // Create new notification        
        const notify: NotificationTypes = {
            to: id,
            title: `Account status - ${status}`,
            message: `Your account has been ${status}.`,
            type: "Account",
            viewed: false,
            createdAt: new Date(),
        }
        await addNotificationDb(notify);

        return NextResponse.json({
            success: true,
            message: "Account status successfully updated!",
        });


    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Failed update account status." },
            { status: 500 }
        );
    }
};