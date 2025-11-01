import { Html } from "@react-email/html";
import { Body, Container, Section, Text, Img, Hr } from "@react-email/components";
import { brand } from "../config/brand";

export const BaseLayout = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Html>
        <Body style={{ backgroundColor: "#f9fafb", fontFamily: "sans-serif" }}>
            <Container style={{ background: "#fff", borderRadius: 8, padding: "24px", maxWidth: "600px", margin: "40px auto" }}>
                <Section style={{ textAlign: "center", marginBottom: 20}}>
                    <Img src={brand.logo} alt={brand.name} width="120" />
                    <Text style={{ fontSize: "24px", fontWeight: "bold", color: brand.color.primary }}>{title}</Text>
                </Section>

                <Section>
                    {children}
                </Section>

                <Hr style={{ margin: "24px 0", borderColor: "#e5e7eb" }} />

                <Text style={{ fontSize: "12px", color: brand.color.lightText, textAlign: "center" }}>
                    © {new Date().getFullYear()} {brand.name}. All rights reserved.
                </Text>
            </Container>
        </Body>
    </Html>
);
