import { BaseLayout } from "./components/BaseLayout";
import { Text, Button } from "@react-email/components";
import { brand } from "./config/brand";

export const PasswordResetEmail = ({ name, resetLink, otp }: { name: string; resetLink: string, otp: string }) => (
    <BaseLayout title="Password Reset Request">
        <Text style={{ color: brand.color.text }}>Hi {name},</Text>
        <Text style={{ color: brand.color.text }}>
            You requested to reset your password. Please use the OTP or click the button below to set a new one.
        </Text>
        <Text style={{ fontSize: "24px", fontWeight: "bold", color: brand.color.primary, letterSpacing: "4px", textAlign: "center" }}>
            {otp}
        </Text>
        <Button href={resetLink} style={{ backgroundColor: brand.color.primary, color: "#fff", padding: "12px 24px", borderRadius: 6, textDecoration: "none" }}>
            Reset Password
        </Button>
        <Text style={{ fontSize: "14px", color: brand.color.lightText }}>This link expires in 15 minutes.</Text>

        <Text style={{ color: brand.color.text }}>
            If you {"didn't"} make this request you can ignore this message. Pleae contact our support team for other matters at {brand.supportEmail}.
        </Text>
    </BaseLayout>
);
