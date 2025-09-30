
import { db, storage } from "./config"
import { PropertyTypes } from "@/types/property.types"
import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"

// const normalize = (data: Record<string, any>) => {
//     return Object.fromEntries(
//         Object.entries(data).map(([key, value]) => [
//             key,
//             value === undefined ? null : value,
//         ])
//     )
// }


export async function addProperty(property: PropertyTypes) {
    try {
        // Normalize payload before saving
        const normalized = {
            ...property,

            // Always enforce strings for phone numbers
            agentPhone: String(property.agentPhone || ""),           

            // Prevent undefined values (replace with null)
            ...Object.fromEntries(
                Object.entries(property).map(([k, v]) => [k, v === undefined ? null : v])
            ),
            
            // Ensure timestamps are Firestore-compatible
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        console.log("Final payload:", normalized);

        // Save to Firestore
        const docRef = await addDoc(collection(db, "properties"), normalized);
        console.log("✅ Property saved with ID:", docRef.id);

        return docRef.id;
    } catch (err) {
        console.error("❌ Error adding property:", err);
        throw err;
    }
};

export async function getProperties() {
    const querySnapshot = await getDocs(collection(db, "properties"))
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as PropertyTypes[]
}

export async function uploadPropertyImage(file: File, propertyId: string) {
    const storageRef = ref(storage, `properties/${propertyId}/${file.name}`)
    await uploadBytes(storageRef, file)
    return await getDownloadURL(storageRef)
}
