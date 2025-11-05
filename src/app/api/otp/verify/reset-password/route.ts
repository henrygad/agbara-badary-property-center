import { getAgentByEmailDb, updateAgentDb } from "@/lib/firebase/agent_service";
import { validateEmail } from "@/utils";
import { generateOTPWithExpiry } from "@/utils/otp";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {

    try {
        const body = (await req.json()) as { email: string, otp: string };
        const { email, otp } = body;

        // Validate incoming requests
        if (!email || !otp) {
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
            foundAgent?.resetPasswordVerificationOtp !== otp.trim()
        ) {
            return NextResponse.json(
                { success: false, message: "Invalid OTP!" },
                { status: 400 }
            );
        }        

        // Check if otp has expired
        if (Date.now() > (foundAgent.resetPasswordVerificationOtpExpireingTime || 0)) {
            return NextResponse.json(
                { success: false, message: "OTP has expired! Request for a new one" },
                { status: 400 }
            );
        }

        // Create a reset token
        const { otp: token, expiresAt } = generateOTPWithExpiry(10);
        const resetToken = {
            token,
            expiresAt
        }

        // Update db
        await updateAgentDb(foundAgent.id, { resetToken, resetPasswordVerificationOtp: "", resetPasswordVerificationOtpExpireingTime: 0 });
                

        // Set reset token cookies for agent
        const cookieStore = await cookies();
        cookieStore.set("resetToken", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 10 * 60, // 10 minutes
            path: "/",
        });
        

        return NextResponse.json({
            success: true,
            message: "You Can now reset password.",
        });


    } catch (error) {
        console.error("Error reseting password: ", error);
        return NextResponse.json(
            { success: false, message: "Failed to verified otp." },
            { status: 500 }
        );
    }
};