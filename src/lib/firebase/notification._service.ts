
import NotificationTypes from "@/types/notification.types";
import { db } from "./config"
import { formatteFireStoreDate } from "@/utils"
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, query, where, orderBy, onSnapshot } from "firebase/firestore"


// Listen for notifications
export function listenToNotifications(userId: string, callback: (data: NotificationTypes[]) => void) {
    const q = query(
        collection(db, "notifications"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...formatteFireStoreDate(doc.data())
        })) as NotificationTypes[];

        callback(data);
    });
}


// Fetch agent by user id
export async function getNotificationByUserIdDb(userId: string) {
    try {

        const q = query(
            collection(db, "notifications"),
            where("to", "==", userId),
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...formatteFireStoreDate(doc.data())
            })) as NotificationTypes[];
        }        
    } catch (error) {
        console.error("Error fetching notification by UserID:", error);
        throw error;
    }
}

// Create a new agent account
export async function addNotificationDb(agent: NotificationTypes) {
    try {
        // Normalize payload before saving
        const normalized = {
            ...Object.fromEntries(
                Object.entries(agent).map(([k, v]) => [k, v === undefined ? null : v])) as NotificationTypes,
        };

        const { id, ...rest } = normalized;

        if (id) {
            // do nothing
        }

        // Save to Firestore
        const docRef = await addDoc(collection(db, "notifications"), rest);

        // Get the doc snapshot back
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = formatteFireStoreDate(docSnap.data())
            return { id: docRef.id, ...data } as NotificationTypes
        } else {
            throw new Error("No notification found!");
        }

    } catch (err) {
        console.error("❌ Error creating new notifications:", err);
        throw err;
    }
};

// Update agent by ID
export async function updateNotificationDb(id: string, { viewed }: { viewed: boolean }) {
    try {
        const docRef = doc(db, "notifications", id);
        await updateDoc(docRef, { viewed });

        const docSnap = await getDoc(docRef);
        let getUpdatedData = docSnap.data()

        if (getUpdatedData) {
            getUpdatedData = formatteFireStoreDate(getUpdatedData);
        }

        return { id: docRef.id, ...getUpdatedData } as NotificationTypes;
    } catch (error) {
        console.error("Error updating notification:", error);
        throw error;
    }
};
