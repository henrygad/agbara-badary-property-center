import { getAgentByEmailDb, updateAgentDb } from "@/lib/firebase/agent_service";
import { mailOptions, transporter } from "@/lib/nodemailer/config";
import { validateEmail } from "@/utils";
import { generateOTPWithExpiry } from "@/utils/otp";
import { render } from "@react-email/components";
import { NextResponse } from "next/server";
import { VerifyEmail } from "../../../../emails/VerifyEmail";
import { PasswordResetEmail } from "../../../../emails/PasswordResetEmail";

export async function POST(req: Request) {

    try {

        const body = (await req.json()) as { email: string, type: "Verify Email" | "Reset Password" };
        const { email, type } = body;

        console.log(body)

        // Validate incoming requests
        if (!email || !(type === "Verify Email" || type === "Reset Password")) {
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

        // Check if user exist
        const foundAgent = await getAgentByEmailDb(email);

        if (!foundAgent || !foundAgent.id) {
            return NextResponse.json(
                { success: false, message: "User not found!" },
                { status: 400 }
            );
        }

        // 4) Handle opt request for agent
        const name = `${foundAgent.firstName} ${foundAgent.lastName}`;
        const { otp, expiresAt } = generateOTPWithExpiry(15);
        
        if (type === "Verify Email") {
            const verifyLink = `${process.env.NEXT_PUBLIC_APP_DNS}/auth/verify-email/link/?email=${foundAgent.email}&otp=${otp}`;
            // 5) Store update to db
            await updateAgentDb(foundAgent.id,
                {
                    emailVerificationOtp: otp,
                    emailVerificationOtpExpireingTime: expiresAt
                });

            // 6) Send to agent
            const verifyHtml = await render(VerifyEmail({ name, otp, verifyLink }));
            await transporter.sendMail({
                ...mailOptions,
                to: foundAgent.email,
                subject: `Emial verification OTP`,
                html: verifyHtml,
            });
        }

        if (type === "Reset Password") {
            const resetLink = `${process.env.NEXT_PUBLIC_APP_DNS}/auth/forget-password/verify-account/link/?email=${foundAgent.email}&otp=${otp}`;

            // 5) Store update to db
            await updateAgentDb(foundAgent.id,
                {
                    resetPasswordVerificationOtp: otp,
                    resetPasswordVerificationOtpExpireingTime: expiresAt
                });
            // 6) Send to agent
            const resetHtml = await render(PasswordResetEmail({ name, resetLink, otp }));

            await transporter.sendMail({
                ...mailOptions,
                to: foundAgent.email,
                subject: `Reset password OTP`,
                html: resetHtml,
            });
        }


        return NextResponse.json({
            success: true,
            message: "OTP sent successfully!",
        });


    } catch (error) {
        console.error("OTP error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to send otp." },
            { status: 500 }
        );
    }
};