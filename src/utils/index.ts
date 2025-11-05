import { DocumentData } from "firebase/firestore";
import { JWTPayload, jwtVerify } from "jose";
import { NextRequest } from "next/server";

export const formatCurrency = (value?: number | null) => {
    if (!value || isNaN(value)) return "0";
    return `₦${value.toLocaleString()}`;
};

export const safeValue = (value?: string | number | null) => {
    if (!value || value === "" || value === null || value === Infinity)
        return "—";
    return value;
};

export const fiterSEOSlug = (v: string) => {
    let copyV = v;
    copyV = copyV.split(" ").join("-");
    return copyV;
};

export const formatDate = (date: Date | undefined) => {
    if (!date) {
        return ""
    }

    return new Date(date).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
}

export const getCookieFromClient = (req: NextRequest) => {    
    const DNS = process.env.NEXT_PUBLIC_APP_DSN || "agbarabadagrypropertycenter.com";
    const pattern = new RegExp(`__Host-${DNS}_client_id=([^;]+)`);

    const cookie = req.headers.get("cookie") || "";
    const match = cookie.match(pattern);

    const clientId = match ? match[1] : null;

    return clientId

};
 
export function getOptimizedImage(url: string, width = 1200) {
    return url.replace(
        "/upload/",
        `/upload/f_auto,q_auto,w_${width}/`
    );
}

export const formatteFireStoreDate = (data: DocumentData) => {
    data.createdAt = new Date(data.createdAt?.seconds * 1000);
    data.updatedAt = new Date(data.updatedAt?.seconds * 1000);
    if (data?.lastLogin) {
        data.lastLogin = new Date(data.lastLogin.seconds * 1000);
    }
    return data;
}

export const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export function maskEmail(email: string): string {
    if (!email || !email.includes("@")) return email;

    const [local, domain] = email.split("@");
    if (local.length <= 2) {
        // If the local part is very short, just hide one char
        return `${local[0] || "*"}***@${domain}`;
    }

    const visiblePart = local.slice(0, 2);
    const hiddenPart = "*".repeat(Math.max(4, local.length - 2));
    return `${visiblePart}${hiddenPart}@${domain}`;
}

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET!);

interface JwtPayload extends JWTPayload {
    id: string;
    email: string;
    accountType: "Agent" | "Admin";
    exp: number;
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload as JwtPayload;
    } catch (err) {
        console.log(err);
        return null;
    }
}
