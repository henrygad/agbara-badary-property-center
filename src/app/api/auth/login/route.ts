import { getAgentByEmailDb, updateAgentDb } from "@/lib/firebase/agent_service";
import { LoginTypes } from "@/types/auth.types";
import { validateEmail } from "@/utils";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { SignJWT } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(req: Request) {

    try {

        const body = (await req.json()) as LoginTypes;
        const { email, password, rememberMe } = body;

        // Validate incoming requests
        if (!email || !password) {
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
                { success: false, message: "Wrong email!" },
                { status: 400 }
            );
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, foundAgent.password);
        if (!isMatch) {
            return NextResponse.json(
                { success: false, message: "Incorrect password!" },
                { status: 400 }
            );
        }

        // Update user last login    
        await updateAgentDb(foundAgent.id, { lastLogin: new Date() });

        const { password: p, ...rest } = foundAgent;
        if (p) {
            //nothing
        }
        const agent = rest

        // Expiration depends on "Remember Me"
        const jwtExpiresIn = rememberMe ? "7d" : "2h";

        const token = await new SignJWT({
            id: agent.id,
            email: agent.email,
            accountType: agent.accountType
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime(jwtExpiresIn) // Remember me → 7 days, else 1 hour
            .sign(SECRET_KEY);

        const response = NextResponse.json({
            success: true,
            message: "Agent login successfully!",
            agent,
        });

        // Set HTTP-only cookie for security        
        response.cookies.set("auth_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: rememberMe ? 7 * (24 * (60 * 60)) : 2 * (60 * 60), // 7 days or 2 hours
            path: "/",
        });

        return response;     

    } catch (error) {
        console.error("Registration email error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to login." },
            { status: 500 }
        );
    }
};

