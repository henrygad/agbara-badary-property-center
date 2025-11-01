
import { db } from "./config"
import UserTypes from "@/types/user.types"
import { formatteFireStoreDate } from "@/utils"
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore"

// Fetch all agents
export async function getAgentsDb() {
    const querySnapshot = await getDocs(collection(db, "agents"))

    return querySnapshot.docs.map(doc => {
        const data = formatteFireStoreDate(doc.data());
        return { id: doc.id, ...data };
    }) as UserTypes[]
}

// Fetch agent by ID
export async function getAgentByIdDb(id: string) {
    try {
        const docRef = doc(db, "agents", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = formatteFireStoreDate(docSnap.data());
            return { id: docRef.id, ...data } as UserTypes;
        }
        throw new Error("No user founder!");
    } catch (error) {
        console.error("Error fetching agent by ID:", error);
        throw error;
    }
}

// Fetch agent by Email
export async function getAgentByEmailDb(email: string) {
    try {

        const q = query(
            collection(db, "agents"),
            where("email", "==", email),
        );

        const snapshot = await getDocs(q);        

        if (!snapshot.empty) {
            const found = snapshot.docs[0]
            const data = formatteFireStoreDate(found.data());           
            return { id: found.id, ...data } as UserTypes;
        }

        return null;
    } catch (error) {
        console.error("Error fetching agent by email:", error);
        return null;
    }
}

// Create a new agent account
export async function addAgentDb(agent: UserTypes) {
    try {
        // Normalize payload before saving
        const normalized = {
            ...Object.fromEntries(
                Object.entries(agent).map(([k, v]) => [k, v === undefined ? null : v])) as UserTypes,
        };

        const { id, ...rest } = normalized;

        if (id) {
            // do nothing
        }

        // Save to Firestore
        const docRef = await addDoc(collection(db, "agents"), rest);

        // Get the doc snapshot back
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = formatteFireStoreDate(docSnap.data())
            return { id: docRef.id, ...data } as UserTypes
        } 

        return null

    } catch (err) {
        console.error("❌ Error creating new agent:", err);
        return null
    }
};

// Update agent by ID
export async function updateAgentDb(id: string, data: Partial<UserTypes>) {
    try {
        const normalized = {
            ...Object.fromEntries(
                Object.entries(data).map(([k, v]) => [k, v === undefined ? null : v])) as Partial<UserTypes>
        };

        const docRef = doc(db, "agents", id);
        await updateDoc(docRef, { ...normalized });

        const docSnap = await getDoc(docRef);
        let getUpdatedData = docSnap.data()

        if (getUpdatedData) {
            getUpdatedData = formatteFireStoreDate(getUpdatedData);
        }

        return { id: docRef.id, ...getUpdatedData } as UserTypes;
    } catch (error) {
        console.error("Error updating account:", error);
        return null
    }
}

// Delete agent account by ID
export async function deleteAgentDb(id: string) {
    try {
        const docRef = doc(db, "agents", id);
        await deleteDoc(docRef);
        return { id, deleted: true };
    } catch (error) {
        console.error("Error deleting account!:", error);
        throw error;
    }
}
