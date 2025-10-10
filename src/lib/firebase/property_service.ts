
import { db } from "./config"
import { PropertyTypes } from "@/types/property.types"
import { collection, addDoc, serverTimestamp, getDocs, getDoc, doc, updateDoc, deleteDoc, DocumentData } from "firebase/firestore"

const formatteFireStoreDate = (data: DocumentData) => {
    data.createdAt = new Date(data.createdAt?.seconds * 1000);
    data.updatedAt = new Date(data.updatedAt?.seconds * 1000);
    return data;
}

// Fetch all properties
export async function getPropertiesDb() {
    const querySnapshot = await getDocs(collection(db, "properties"))

    return querySnapshot.docs.map(doc => {
        const data = formatteFireStoreDate(doc.data());
        return { id: doc.id, ...data };
    }) as PropertyTypes[]
}

// Fetch single property by ID
export async function getPropertyByIdDb(id: string) {
    try {
        const docRef = doc(db, "properties", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = formatteFireStoreDate(docSnap.data());
            return { id: docRef.id, ...data } as PropertyTypes;
        }
        throw new Error("No such document!");
    } catch (error) {
        console.error("Error fetching property by ID:", error);
        throw error;
    }
}

// Create a new property
export async function addPropertyDb(property: PropertyTypes) {
    try {
        // Normalize payload before saving
        const normalized = {
            ...property,                                            
            ...Object.fromEntries(
                Object.entries(property).map(([k, v]) => [k, v === undefined ? null : v])),                                  
            updatedAt: serverTimestamp(),
        };

        const { id, ...rest } = normalized;

        if (id) {
             // do nothing
         }

        // Save to Firestore
        const docRef = await addDoc(collection(db, "properties"), rest);

        // Get the doc snapshot back
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = formatteFireStoreDate(docSnap.data())
            return { id: docRef.id, ...data } as PropertyTypes
        } else {
            throw new Error("No such document!");
        }

    } catch (err) {
        console.error("❌ Error adding property:", err);
        throw err;
    }
};

// Update property by ID
export async function updatePropertyDb(id: string, data: Partial<PropertyTypes>) {
    try {
        const docRef = doc(db, "properties", id);
        await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() }); // updates only the fields you pass

        const docSnap = await getDoc(docRef);
        let getUpdatedData = docSnap.data()
        if (getUpdatedData) {
            getUpdatedData = formatteFireStoreDate(getUpdatedData);
        }

        return { id: docRef.id, ...getUpdatedData } as PropertyTypes;
    } catch (error) {
        console.error("Error updating property:", error);
        throw error;
    }
}

// Delete property by ID
export async function deletePropertyDb(id: string) {
    try {
        const docRef = doc(db, "properties", id);
        await deleteDoc(docRef);
        return { id, deleted: true };
    } catch (error) {
        console.error("Error deleting property:", error);
        throw error;
    }
}
