// Fetch Properties by search queries
import { SearchParams } from "@/types/search.types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./config";
import { PropertyTypes } from "@/types/property.types";


export async function searchProperties(params: SearchParams) {
    const conditions = [];

    // Build Firestore query conditions
    if (params.state) {
        conditions.push(where("state", "==", params.state));
    }
    if (params.city) {
        conditions.push(where("city", "==", params.city));
    }
    if (params.minPrice !== undefined) {
        conditions.push(where("price", ">=", params.minPrice));
    }
    if (params.maxPrice !== undefined) {
        conditions.push(where("price", "<=", params.maxPrice));
    }
    if (params.status) {
        conditions.push(where("status", "==", params.status));
    }
    if (params.type) {
        conditions.push(where("type", "==", params.type));
    }

    // At least one of the amenities must match
    if (params.amenities && params.amenities.length > 0) {
        conditions.push(where("amenities", "array-contains-any", params.amenities));
    }

    // Run Firestore query
    const q = query(collection(db, "properties"), ...conditions);
    const snapshot = await getDocs(q);

    let results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PropertyTypes[];

    // Local filter for all amenities (AND logic)
    if (params.amenities && params.amenities.length > 0) {
        results = results.filter(property =>
            params.amenities!.every(a => property.amenities?.includes(a))
        );
    }

    // Local keyword search (basic case-insensitive matching)
    if (params.keyword) {
        const keywords = params.keyword.toLowerCase().split(/\s+/);

        results = results.filter(property => {
            const searchableText = `${property.title ?? ""} ${property.description ?? ""} ${property.amenities?.join(" ") ?? ""}`.toLowerCase();

            return keywords.every(kw => searchableText.includes(kw));
        });
    }

    return results;
};
