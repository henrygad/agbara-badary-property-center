import { BaseLayout } from "./components/BaseLayout";
import { Text, Button } from "@react-email/components";
import { brand } from "./config/brand";

export const VerifiedEmail = ({ name }: { name: string }) => (
    <BaseLayout title="Account Approved">
        <Text style={{ color: brand.color.text }}>Hi {name},</Text>
        <Text style={{ color: brand.color.text }}>
            Your account has been successfully approved. You can now list properties on your dashboard.
        </Text>
        <Button href={`${brand.website}/agent/add-property`} style={{ backgroundColor: brand.color.primary, color: "#fff", padding: "12px 24px", borderRadius: 6, textDecoration: "none" }}>
            Go to Dashboard
        </Button>
    </BaseLayout>
);
