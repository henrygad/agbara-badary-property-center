import { BaseLayout } from "./components/BaseLayout";
import { Text, Link } from "@react-email/components";
import { brand } from "./config/brand";
import { PropertyTypes } from "@/types/property.types";

export const AgentProperty = ({ name, availability, title, refId }: { refId: string, name: string, availability: PropertyTypes["availability"], title: string }) => (
    <BaseLayout title={`Property ${availability}`}>
        <Text style={{ color: brand.color.text }}>Hi {name},</Text>
        {
            availability === "Accepted" ?
                <>
                    <Text style={{ color: brand.color.text }}>
                        Your Property {title} , has been successfully approved. You can now view it live
                    </Text>

                    <Text style={{ fontSize: "14px", color: brand.color.lightText }}>
                        <strong>Property title:</strong> {title}
                    </Text>

                    <Text style={{ fontSize: "14px", color: brand.color.lightText }}>
                        <strong>Property refid:</strong> {refId}
                    </Text>

                    <Link href={`${brand.website}/agent/add-property`} style={{ backgroundColor: brand.color.primary, color: "#fff", padding: "12px 24px", borderRadius: 6, textDecoration: "none" }}>
                        {title}
                    </Link>
                </> :
                availability === "Rejected" ?
                <>
                    <Text style={{ color: brand.color.text }}>
                        Your property {title}, has been <Text style={{ color: "red", fontWeight: "bold", fontSize: "20" }}>{availability}</Text>
                    </Text>
                    <Text style={{ fontSize: "14px", color: brand.color.lightText }}>
                        <strong>Property title:</strong> {title}
                    </Text>

                        <Text style={{ fontSize: "14px", color: brand.color.lightText }}>
                            <strong>Property refid:</strong> {refId}
                        </Text>
                    </> :
                    <>
                        <Text style={{ color: brand.color.text }}>
                            Your property {title}, is under <Text style={{ color: "red", fontWeight: "bold", fontSize: "20" }}>{availability}</Text>
                        </Text>
                        <Text style={{ fontSize: "14px", color: brand.color.lightText }}>
                            <strong>Property title:</strong> {title}
                        </Text>

                        <Text style={{ fontSize: "14px", color: brand.color.lightText }}>
                            <strong>Property refid:</strong> {refId}
                        </Text>
                    </>                                                          
        }
    </BaseLayout>
);
