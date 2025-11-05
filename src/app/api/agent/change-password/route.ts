

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { validateEmail } from "@/utils";
import { getAgentByEmailDb, updateAgentDb } from "@/lib/firebase/agent_service";
import { mailOptions, transporter } from "@/lib/nodemailer/config";
import { render } from "@react-email/components";
import { PasswordChangedEmail } from "../../../../../emails/PasswordChangedEmail";

export async function POST(req: Request) {
    const body = await req.json() as {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
        email: string
    };

    const { currentPassword, newPassword, email } = body;

    // Validate incoming requests
    if (!currentPassword || !newPassword || !email) {
        return NextResponse.json(
            { success: false, message: "Incomplate data!" },
            { status: 400 }
        );
    }

    if (!validateEmail(email)) {
        return NextResponse.json(
            { success: false, message: "Invalid email!" },
            { status: 400 }
        );
    }

    // Find  user
    const foundAgent = await getAgentByEmailDb(email);
    if (!foundAgent || !foundAgent.id) {
        return NextResponse.json(
            { success: false, message: "User not found!" },
            { status: 404 }
        );
    }

    // Check is new is the same with old password    
    const isMatch = await bcrypt.compare(newPassword, foundAgent.password);
    if (isMatch) {
        return NextResponse.json(
            { success: false, message: "Can't use the old password as new" },
            { status: 400 }
        );
    }

    // hash password
    const hashedPassword = await bcrypt.hash(newPassword, 10); // saltRounds = 10

    // Update user password
    await updateAgentDb(foundAgent.id, { password: hashedPassword });


    // Send email to agent
    const name = `${foundAgent.firstName} ${foundAgent.lastName}`;

    // Send a email sucessfull verified email to agent
    const changedHtml = await render(PasswordChangedEmail({ name }));
    await transporter.sendMail({
        ...mailOptions,
        to: foundAgent.email,
        subject: `Your password have been change sucessfully`,
        html: changedHtml,
    });

    return NextResponse.json({ success: true, message: "sucessfully change password!" });
};

