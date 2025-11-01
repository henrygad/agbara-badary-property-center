import { BaseLayout } from "./components/BaseLayout";
import { Text } from "@react-email/components";
import { brand } from "./config/brand";

export const PropertyRequestEmail = ({ name, propertyTitle, referenceId }: { name: string, propertyTitle: string, referenceId: string }) => (
    <BaseLayout title="Property Request Received">
        <Text style={{ color: brand.color.text }}>Hi {name},</Text>
        <Text style={{ color: brand.color.text }}>
            We’ve received your request about <strong>${propertyTitle}</strong>. Our team will contact you shortly.
        </Text>
        <Text style={{ fontSize: "14px", color: brand.color.lightText }}><strong>Property name:</strong> {propertyTitle}</Text>
        <Text style={{ fontSize: "14px", color: brand.color.lightText }}><strong>Property refid:</strong> {referenceId}</Text>        

        <Text style={{ color: brand.color.text, marginTop: "2px" }}>If you have any urgent questions, feel free to reply to this email or call us directly.</Text>
        <Text style={{ color: brand.color.lightText, fontSize: "14px" }}>Best regards,
            <br />{brand.name} Team</Text>
    </BaseLayout>
);
