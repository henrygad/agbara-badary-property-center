import { BaseLayout } from "./components/BaseLayout";
import { Text } from "@react-email/components";
import { brand } from "./config/brand";

export const ContactReplyEmail = ({ name }: { name: string }) => (
    <BaseLayout title="We Received Your Message">
        <Text style={{ color: brand.color.text }}>Hi {name},</Text>
        <Text style={{ color: brand.color.text }}>
            Thank you for contacting {brand.name}. We’ve received your message and will get back to you shortly.
        </Text>
        <Text style={{ color: brand.color.lightText, fontSize: "14px" }}>Best regards,
            <br />The {brand.name} Team</Text>
    </BaseLayout>
);
