import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import { WelcomeAgentEmail } from "@/../emails/WelcomeAgentEmail";
import { AdminNotification } from "@/../emails/AdminNotification";
import { brand } from "@/../emails/config/brand";
import { RegisterTypes } from "@/types/auth.types";
import { validateEmail } from "@/utils";
import { getAgentByEmailDb, addAgentDb, updateAgentDb } from "@/lib/firebase/agent_service";
import bcrypt from "bcryptjs";
import UserTypes from "@/types/user.types";
import { generateOTPWithExpiry } from "@/utils/otp";
import { mailOptions, transporter } from "@/lib/nodemailer/config";
import { addNotificationDb } from "@/lib/firebase/notification._service";
import NotificationTypes from "@/types/notification.types";


export async function POST(req: Request) {

    try {
        const body: RegisterTypes = await req.json() as RegisterTypes;
        const { firstName, lastName, email, phone, phoneCode, password, confirmPassword, agreeToTerms, accountType } = body;        

        // Validate request
        if (agreeToTerms !== true) {
            return NextResponse.json(
                { success: false, message: "Most agree to terms!" },
                { status: 400 }
            );
        }

        if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim() || !accountType.trim()) {
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

        if (password.trim() !== confirmPassword.trim()) {
            return NextResponse.json(
                { success: false, message: "Password does not match!" },
                { status: 400 }
            );
        }

        // Check if an account exist with the request email
        const foundAgent = await getAgentByEmailDb(email);
        if (foundAgent) {
            return NextResponse.json(
                { success: false, message: "This email has been used!" },
                { status: 400 }
            );
        }

        // Create new agent account
        // 1) hash password
        const hashedPassword = await bcrypt.hash(password, 10); // saltRounds = 10

        // 2) sanitized Data
        const sanitizedData: UserTypes = {
            firstName,
            lastName,
            email,
            phone,
            phoneCode,
            // store only the hashed password
            password: hashedPassword,
            confirmPassword: "",
            agreeToTerms,
            accountType: "Agent",
            accountStatus: "Pending",
            emailIsVerified: false,            
            rememberMe: false,
            lastLogin: "",
            createdAt: new Date(),
        };

        // 3) Save data to db
        const newAgent = await addAgentDb(sanitizedData);

        if (!newAgent || !newAgent.id) {
            return NextResponse.json(
                { success: false, message: "Account was not registered!" },
                { status: 400 }
            );
        }

        // 4) Handle agent email verification
        const name = `${newAgent.firstName} ${newAgent.lastName}`;
        const { otp, expiresAt } = generateOTPWithExpiry(15);
        const verifyLink = `${process.env.NEXT_PUBLIC_APP_DNS}/auth/verify-email?email=${newAgent.email}&otp=${otp}`;

        // 4.i) Store update to db
        await updateAgentDb(newAgent.id,
            {
                emailVerificationOtp: otp,
                emailVerificationOtpExpireingTime: expiresAt
            });

        // 5) Send Emails

        // 5.i) To new user
        const welcomeHtml = await render(WelcomeAgentEmail({ name, otp, verifyLink }));

        await transporter.sendMail({
            ...mailOptions,
            to: newAgent.email,
            subject: `Welcome to ${brand.name} – Verify Your Email`,
            html: welcomeHtml,
        });

        // 5.ii) To admin        
        const adminHtml = await render(AdminNotification({ subject: `A new agent has registered with the email: ${newAgent.email}.`, name, message: `A new agent has registered with the email: ${newAgent.email}.`, email: newAgent.email }));

        await transporter.sendMail({
            ...mailOptions,
            to: process.env.NEXT_PUBLIC_GMAIL,
            subject: `New Agent Registered – ${name}`,
            html: adminHtml,
        });

        // 6) Send notification to admin
        const notify: NotificationTypes = {
            to: "admin",
            title: "New Account",
            message: `${name} created a new account and it under Pending.`,
            type: "New Account",
            viewed: false,
            createdAt: new Date(),
        }
        await addNotificationDb(notify);

        return NextResponse.json({
            success: true,
            message: "Agent registered successfully and emails sent.",
        });

    } catch (error) {
        console.error("Registration email error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to registration." },
            { status: 500 }
        );
    }
};


