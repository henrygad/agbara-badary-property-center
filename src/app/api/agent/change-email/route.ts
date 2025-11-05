import { getAgentByEmailDb, updateAgentDb } from "@/lib/firebase/agent_service";
import { mailOptions, transporter } from "@/lib/nodemailer/config";
import { validateEmail } from "@/utils";
import { render } from "@react-email/components";
import { NextResponse } from "next/server";
import { EmailChangedEmail } from "../../../../../emails/EmailChangedEmail";

export async function POST(req: Request) {

    try {

        const body = (await req.json()) as { oldEmail: string, newEmail: string };
        const { oldEmail, newEmail } = body;

        // Validate incoming requests
        if (!oldEmail || !newEmail) {
            return NextResponse.json(
                { success: false, message: "Incomplate data!" },
                { status: 400 }
            );
        }

        // Validaet email
        if (!validateEmail(oldEmail) || !validateEmail(newEmail)) {
            return NextResponse.json(
                { success: false, message: "Invalid email!" },
                { status: 400 }
            );
        }

        if (oldEmail === newEmail) {
            return NextResponse.json(
                { success: false, message: "Use a different email address!" },
                { status: 400 }
            );
        }

        // Check if new email is availible for use
        const emailUsed = await getAgentByEmailDb(newEmail);
        if (emailUsed) {
            return NextResponse.json(
                { success: false, message: "This email has been used." },
                { status: 400 }
            );
        }

        const foundAgent = await getAgentByEmailDb(oldEmail);

        if (!foundAgent || !foundAgent.id) {
            return NextResponse.json(
                { success: false, message: "User not found!" },
                { status: 404 }
            );
        }

        // Verify agent account
        await updateAgentDb(foundAgent.id, {
            emailIsVerified: false,
            emailVerificationOtp: "",
            emailVerificationOtpExpireingTime: 0,
            email: newEmail,
        });

        const name = `${foundAgent.firstName} ${foundAgent.lastName}`;

        // Send a email sucessfull change email to agent
        const changeEmailHtml = await render(EmailChangedEmail({ name }));
        await transporter.sendMail({
            ...mailOptions,
            to: oldEmail,
            subject: `Emial changed successfully`,
            html: changeEmailHtml,
        });


        return NextResponse.json(
            { success: true, message: "Emial changed successfully!" },
            { status: 200 }
        );


    } catch (error) {
        console.error("Error changing email: ", error);
        return NextResponse.json(
            { success: false, message: "Failed to change email." },
            { status: 500 }
        );
    }
};