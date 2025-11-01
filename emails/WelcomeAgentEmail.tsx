import { BaseLayout } from "./components/BaseLayout";
import { Text, Button } from "@react-email/components";
import { brand } from "./config/brand";

export const WelcomeAgentEmail = ({ name, otp, verifyLink }: { name: string; otp: string; verifyLink: string }) => (
    <BaseLayout title="Welcome to Agbara Badagry Property Center!">
        <Text style={{ color: brand.color.text }}>Hi {name},</Text>
        <Text style={{ color: brand.color.text }}>
            We’re excited to have you on board. Use the OTP below to verify your email or click the link.
        </Text>
        <Text style={{ fontSize: "24px", fontWeight: "bold", color: brand.color.primary, letterSpacing: "4px", textAlign: "center" }}>
            {otp}
        </Text>
        <Button href={verifyLink} style={{ backgroundColor: brand.color.primary, color: "#fff", padding: "12px 24px", borderRadius: 6, textDecoration: "none" }}>
            Verify My Email
        </Button>
        <Text style={{ fontSize: "14px", color: brand.color.lightText }}>This code/link will expire in 15 minutes.</Text>
    </BaseLayout>
);
