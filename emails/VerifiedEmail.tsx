import { BaseLayout } from "./components/BaseLayout";
import { Text, Button } from "@react-email/components";
import { brand } from "./config/brand";

export const VerifiedEmail = ({ name }: { name: string }) => (
    <BaseLayout title="Account Verified">
        <Text style={{ color: brand.color.text }}>Hi {name},</Text>
        <Text style={{ color: brand.color.text }}>
            Your email has been successfully verified. You can now access your dashboard.
        </Text>
        <Button href={`${brand.website}/agent`} style={{ backgroundColor: brand.color.primary, color: "#fff", padding: "12px 24px", borderRadius: 6, textDecoration: "none" }}>
            Go to Dashboard
        </Button>
    </BaseLayout>
);
