
import ImageTypes from "@/types/image.types"
import { db } from "./config"
import { collection, addDoc, serverTimestamp, getDocs, getDoc, doc, deleteDoc} from "firebase/firestore"

// Fetch all properties
export async function getImagesDb() {
    const querySnapshot = await getDocs(collection(db, "images"))

    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, ...data }
    }) as ImageTypes[]
}

// Create a new property
export async function addImageDb(image: ImageTypes) {
    try {
        // Normalize payload before saving
        const normalized = {
            ...image,                                            
            ...Object.fromEntries(
                Object.entries(image).map(([k, v]) => [k, v === undefined ? null : v])),                                  
            updatedAt: serverTimestamp(),
        };


        // Save to Firestore
        const docRef = await addDoc(collection(db, "images"), normalized);

        // Get the doc snapshot back
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {id: docSnap.id, ...data } as ImageTypes
        } else {
            throw new Error("No such document!");
        }

    } catch (err) {
        console.error("❌ Error adding images:", err);
        throw err;
    }
};

// Delete property by ID
export async function deleteImageDb(id: string) {
    try {
        const docRef = doc(db, "images", id);
        await deleteDoc(docRef);
        return { id, deleted: true };
    } catch (error) {
        console.error("Error deleting image:", error);
        throw error;
    }
}
