import { getAgentByEmailDb, updateAgentDb } from "@/lib/firebase/agent_service";
import { LoginTypes } from "@/types/auth.types";
import { validateEmail } from "@/utils";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

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

        // Keep user login        
        await updateAgentDb(foundAgent.id, { rememberMe: rememberMe && !foundAgent.rememberMe ? true : false, lastLogin: new Date() });

        const { password: p, ...rest } = foundAgent;
        if (p) {
            //nothing
        }

        return NextResponse.json({
            success: true,
            message: "Agent login successfully !",
            agent: rest,
        });

    } catch (error) {
        console.error("Registration email error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to login." },
            { status: 500 }
        );
    }
};

