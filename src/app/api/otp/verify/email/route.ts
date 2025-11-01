import { getAgentByEmailDb, updateAgentDb } from "@/lib/firebase/agent_service";
import { mailOptions, transporter } from "@/lib/nodemailer/config";
import { validateEmail } from "@/utils";
import { render } from "@react-email/components";
import { NextResponse } from "next/server";
import { VerifiedEmail } from "../../../../../../emails/VerifiedEmail";

export async function POST(req: Request) {

    try {

        const body = (await req.json()) as { email: string, otp: string};
        const { email, otp} = body;

        // Validate incoming requests
        if (!email || !otp ) {
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

        // Check if Otp is valid
        const foundAgent = await getAgentByEmailDb(email);
        if (!foundAgent ||
            !foundAgent.id ||
            foundAgent?.emailVerificationOtp !== otp.trim()
        ) {
            return NextResponse.json(
                { success: false, message: "Invalid OTP!" },
                { status: 400 }
            );
        }

        // Check if otp has expired
        if (Date.now() > (foundAgent.emailVerificationOtpExpireingTime || 0)) {
            return NextResponse.json(
                { success: false, message: "OTP has expired! Request for a new one" },
                { status: 400 }
            );
        }

        // Verify agent account
        await updateAgentDb(foundAgent.id, {
            emailIsVerified: true,
            emailVerificationOtp: "",
            emailVerificationOtpExpireingTime: 0
        });
        
        const name = `${foundAgent.firstName} ${foundAgent.lastName}`;

        // Send a email sucessfull verified email to agent
        const verifiedHtml = await render(VerifiedEmail({ name }));
        await transporter.sendMail({
            ...mailOptions,
            to: foundAgent.email,
            subject: `Emial verification sucessfull`,
            html: verifiedHtml,
        });
        

        return NextResponse.json({
            success: true,
            message: "OTP has been verified successfully!",
        });


    } catch (error) {
        console.error("Error Verifying opt: ", error);
        return NextResponse.json(
            { success: false, message: "Failed to verified otp." },
            { status: 500 }
        );
    }
};