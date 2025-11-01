
import ImageTypes from "@/types/image.types"
import { db } from "./config"
import { collection, addDoc, getDocs, getDoc, doc, deleteDoc, query, where } from "firebase/firestore"
import { formatteFireStoreDate } from "@/utils";

// Fetch all properties
export async function getImagesDb(uploader: string) {

    try {
        const q = query(
            collection(db, "images"),
            where("uploader", "==", uploader),
        );

        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...formatteFireStoreDate(doc.data())
            })) as ImageTypes[]
        }       
    } catch (error) {
        console.error("Error fetching image by uploader:", error);
        throw error;
    }
}

// Create a new property
export async function addImageDb(image: ImageTypes) {
    try {
        // Normalize payload before saving
        const normalized = {                                                
            ...Object.fromEntries(
                Object.entries(image).map(([k, v]) => [k, v === undefined ? null : v])),                                            
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
};

