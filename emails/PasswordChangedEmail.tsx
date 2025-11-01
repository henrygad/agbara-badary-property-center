import { BaseLayout } from "./components/BaseLayout";
import { Text } from "@react-email/components";
import { brand } from "./config/brand";

export const PasswordChangedEmail = ({ name }: { name: string }) => (
    <BaseLayout title="Password Changed">
        <Text style={{ color: brand.color.text }}>Hi {name},</Text>
        <Text style={{ color: brand.color.text }}>
            Your password was recently changed. If this wasn’t you, please contact our support team immediately at {brand.supportEmail}.
        </Text>
    </BaseLayout>
);
