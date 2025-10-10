export const formatCurrency = (value?: number | null) => {
    if (!value || isNaN(value)) return "—";
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