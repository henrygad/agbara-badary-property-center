import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { validateEmail } from "@/utils";
import { getAgentByEmailDb, updateAgentDb } from "@/lib/firebase/agent_service";
import { mailOptions, transporter } from "@/lib/nodemailer/config";
import { render } from "@react-email/components";
import { PasswordChangedEmail } from "../../../../emails/PasswordChangedEmail";

export async function POST(req: Request) {
    const { newPassword, email } = await req.json() as { newPassword: string, email: string };

    // Get reset token
    const cookieStore = await cookies();
    const token = cookieStore.get("resetToken")?.value;

    // Validate request
    if (!token || !email) return NextResponse.json({ error: "Missing credentials" }, { status: 400 });

    if (!validateEmail(email)) {
        return NextResponse.json(
            { success: false, message: "Invalid email!" },
            { status: 400 }
        );
    }

    // Check if Otp is valid
    const foundAgent = await getAgentByEmailDb(email);
    if (!foundAgent ||
        !foundAgent.id ||
        foundAgent?.resetToken?.token.trim() !== token.trim()
    ) {
        return NextResponse.json(
            { success: false, message: "Invalid reset token!" },
            { status: 400 }
        );
    }

    // Check if otp has expired
    if (Date.now() > (foundAgent.resetToken.expiresAt || 0)) {
        return NextResponse.json(
            { success: false, message: "token has expired! Can't reset password this time." },
            { status: 400 }
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
    
    // 1) hash password
    const hashedPassword = await bcrypt.hash(newPassword, 10); // saltRounds = 10

    // Update user password
    await updateAgentDb(foundAgent.id, { password: hashedPassword, resetToken: { token: "", expiresAt: 0 } });

    // Clear cookie
    cookieStore.set("resetToken", "", { maxAge: 0 });

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

    return NextResponse.json({ success: true });
};

