import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./config";
import { PropertyTypes } from "@/types/property.types";
import { SearchTypes } from "@/types/search.types";


export async function searchPropertiesDb(params: SearchTypes) {
    const queries = [];

    if (params.state) {
        queries.push(where("state", "==", params.state));
    }
    if (params.bedrooms) {
        queries.push(where("bedrooms", "==", params.bedrooms));
    }
    if (params.furnishing) {
        queries.push(where("furnishing", "==", params.furnishing));
    }
    if (params.category) {
        queries.push(where("category", "==", params.category));
    }
    if (params.condition) {
        queries.push(where("condition", "==", params.condition));
    }
    if (params.toilets) {
        queries.push(where("toilets", "==", params.toilets));
    }
    if (params.city) {
        queries.push(where("city", "==", params.city));
    }
    if (params.minPrice !== undefined) {
        queries.push(where("price", ">=", params.minPrice));
    }
    if (params.maxPrice !== undefined) {
        queries.push(where("price", "<=", params.maxPrice));
    }
    if (params.status) {
        queries.push(where("status", "==", params.status));
    }
    if (params.type) {
        queries.push(where("type", "==", params.type));
    }    
    if (params.amenities && params.amenities.length > 0) {
        queries.push(where("amenities", "array-contains-any", params.amenities));
    }

    // Run Firestore query
    const q = query(collection(db, "properties"), ...queries);
    const snapshot = await getDocs(q);

    let results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PropertyTypes[];

    // Local filter 
    // For genaral location
    if (params.location) {
        results = results.filter(property =>
            (property.street + property.city + property.state).toLowerCase().trim()
                .includes((params.location || "").toLowerCase().trim()));
    }

    // For all amenities (AND logic)
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
