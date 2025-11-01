import { BaseLayout } from "./components/BaseLayout";
import { Text } from "@react-email/components";
import { brand } from "./config/brand";

type Props = {
    subject: string;
    message: string;
    name: string;
    phone?: string;
    email: string;
    address?: string;
    propertyTitle?: string;
    referenceId?: string
};

export const AdminNotification = ({
    subject,
    message,
    name,
    phone,
    email,
    address,
    propertyTitle,
    referenceId
}: Props) => (
    <BaseLayout title="New Notification">
        <Text style={{ color: brand.color.text }}>Hello Admin,</Text>
        <Text style={{ color: brand.color.text }}>
            You’ve received a new message from <strong>{name}</strong>.
        </Text>
        <Text style={{ fontSize: "14px", color: brand.color.lightText }}>
            <strong>Subject:</strong> {subject}
        </Text>
        <Text style={{ fontSize: "14px", color: brand.color.lightText }}>
            <strong>Name:</strong> {name}
        </Text>
        <Text style={{ fontSize: "14px", color: brand.color.lightText }}>
            <strong>Email:</strong> {email}
        </Text>
        {phone && (
            <Text style={{ fontSize: "14px", color: brand.color.lightText }}>
                <strong>Phone:</strong> {phone}
            </Text>
        )}
        {address && (
            <Text style={{ fontSize: "14px", color: brand.color.lightText }}>
                <strong>Address:</strong> {address}
            </Text>
        )}
        {propertyTitle && (
            <Text style={{ fontSize: "14px", color: brand.color.lightText }}>
                <strong>Property name:</strong> {propertyTitle}
            </Text>
        )}
        {referenceId && (
            <Text style={{ fontSize: "14px", color: brand.color.lightText }}>
                <strong>Property refid:</strong> {referenceId}
            </Text>
        )}

        <Text
            style={{
                color: brand.color.text,
                whiteSpace: "pre-line",
                marginTop: "10px",
            }}
        >
            {message}
        </Text>
    </BaseLayout>
);
