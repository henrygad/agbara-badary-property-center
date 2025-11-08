// utils/generateMonthlyAnalytics.ts

// Firestore Timestamp type (so TypeScript understands .toDate())
interface FirestoreTimestamp {
    toDate(): Date;
}

// Accepts Date, Firestore Timestamp, string (ISO), or number (ms)
type CreatedAt = Date | FirestoreTimestamp | string | number | undefined;

interface Item {
    createdAt?: CreatedAt;
}

export interface AnalyticsResult {
    month: string;
    properties: number;
    requests: number;
}

/**
 * Generate monthly analytics for properties and requests.
 * Safe, type-strict, and supports Firestore timestamps.
 */
export function generateMonthlyAnalytics(
    properties: Item[] = [],
    requests: Item[] = []
): AnalyticsResult[] {
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const analytics: AnalyticsResult[] = months.map((m) => ({
        month: m,
        properties: 0,
        requests: 0,
    }));

    function getMonthIndex(createdAt: CreatedAt): number | null {
        if (!createdAt) return null;

        let date: Date;

        if (createdAt instanceof Date) {
            date = createdAt;
        } else if (
            typeof createdAt === "object" &&
            typeof (createdAt as FirestoreTimestamp).toDate === "function"
        ) {
            date = (createdAt as FirestoreTimestamp).toDate();
        } else if (typeof createdAt === "string" || typeof createdAt === "number") {
            date = new Date(createdAt);
        } else {
            return null;
        }

        const monthIndex = date.getMonth();
        return Number.isFinite(monthIndex) && monthIndex >= 0 && monthIndex < 12
            ? monthIndex
            : null;
    }

    for (const p of properties) {
        const monthIndex = getMonthIndex(p.createdAt);
        if (monthIndex !== null) analytics[monthIndex].properties += 1;
    }

    for (const r of requests) {
        const monthIndex = getMonthIndex(r.createdAt);
        if (monthIndex !== null) analytics[monthIndex].requests += 1;
    }

    return analytics;
}
