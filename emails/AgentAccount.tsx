import { BaseLayout } from "./components/BaseLayout";
import { Text, Button } from "@react-email/components";
import { brand } from "./config/brand";
import UserTypes from "@/types/user.types";

export const AgentAccount = ({ name, status }: { name: string, status: UserTypes["accountStatus"] }) => (
    <BaseLayout title={`Account ${status}`}>
        <Text style={{ color: brand.color.text }}>Hi {name},</Text>
        {
            status === "Approved" ?
                <>
                    <Text style={{ color: brand.color.text }}>
                        Your account has been successfully approved. You can now list properties on your dashboard.
                    </Text>
                    <Button href={`${brand.website}/agent/add-property`} style={{ backgroundColor: brand.color.primary, color: "#fff", padding: "12px 24px", borderRadius: 6, textDecoration: "none" }}>
                        Go to Dashboard
                    </Button>
                </> :
                <Text style={{ color: brand.color.text }}>
                    Your account has been <Text style={{ color: "red", fontWeight: "bold", fontSize: "20" }}>{status}</Text>
                </Text>
        }
    </BaseLayout>
);
