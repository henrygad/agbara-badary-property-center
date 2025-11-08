// utils/calculateChange.ts
interface Item {
    createdAt?: Date;
}

interface MetricChange {
    current: number;
    previous: number;
    change: number; // percentage difference
}

/**
 * Calculates percentage change between time periods.
 * @param items Array of documents with `createdAt` as JS Date
 * @param period "month" | "week"
 */
export function calculateChange(
    items: Item[],
    period: "month" | "week" = "month"
): MetricChange {
    const now = new Date();

    let startOfThisPeriod: Date;
    let startOfLastPeriod: Date;
    let endOfLastPeriod: Date;

    if (period === "month") {
        startOfThisPeriod = new Date(now.getFullYear(), now.getMonth(), 1);
        startOfLastPeriod = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endOfLastPeriod = new Date(now.getFullYear(), now.getMonth(), 0);
    } else {
        // Weekly logic
        const dayOfWeek = now.getDay(); // 0 (Sun) - 6 (Sat)
        startOfThisPeriod = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - dayOfWeek
        );
        startOfLastPeriod = new Date(
            startOfThisPeriod.getFullYear(),
            startOfThisPeriod.getMonth(),
            startOfThisPeriod.getDate() - 7
        );
        endOfLastPeriod = new Date(startOfThisPeriod.getTime() - 1);
    }

    let current = 0;
    let previous = 0;

    for (const item of items) {
        // if (!item.createdAt) return { current, previous, change };
        const createdAt = item.createdAt;
        if (createdAt && createdAt >= startOfThisPeriod) current++;
        else if (createdAt && createdAt >= startOfLastPeriod && createdAt <= endOfLastPeriod)
            previous++;
    }

    const change =
        previous === 0
            ? current > 0
                ? 100
                : 0
            : Math.round(((current - previous) / previous) * 100);

    return { current, previous, change };
}
