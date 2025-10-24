import { DocumentData } from "firebase/firestore";
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
    const DNS = process.env.NEXT_PUBLIC_APP_DSN;
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
    return data;
}
