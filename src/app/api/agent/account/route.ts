
import { mailOptions, transporter } from "@/lib/nodemailer/config";
import { validateEmail, verifyToken } from "@/utils";
import { render } from "@react-email/components";
import { NextRequest, NextResponse } from "next/server";
import UserTypes from "@/types/user.types";
import { AgentAccount } from "../../../../../emails/AgentAccount";
import NotificationTypes from "@/types/notification.types";
import { addNotificationDb } from "@/lib/firebase/notification._service";
import { deleteAgentDb, getAgentByEmailDb, getAgentByIdDb } from "@/lib/firebase/agent_service";
import bcrypt from "bcryptjs";


// Aet agent data
export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("auth_token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify the token and cast the result
        const decoded = await verifyToken(token);

        // Safely access the email
        const id = decoded?.id;

        if (!id) {
            return NextResponse.json({ error: "Invalid token payload" }, { status: 400 });
        }

        const foundAgent = await getAgentByIdDb(id);

        if (!foundAgent) {
            return NextResponse.json({ error: "Agent not found" }, { status: 404 });
        }

        const { password, ...rest } = foundAgent;
        if (password) {
            // do nothing
        }

        const agent = rest;

        return NextResponse.json({
            success: true,
            message: "Fetch agent successfully!",
            agent,
        });

    } catch (error) {
        console.error("JWT verification failed:", error);
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
}

// Aprove agent account
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

// Delete agent account
export async function DELETE(req: Request) {

    try {

        const body = (await req.json()) as { email: string, password: string };
        const { email, password } = body;

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

        // Delete agent account
        await deleteAgentDb(foundAgent.id);            

        return NextResponse.json({
            success: true,
            message: "Successfully deletd agent account!",         
        });

    } catch (error) {
        console.error("Delete account error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete acoount." },
            { status: 500 }
        );
    }
};
