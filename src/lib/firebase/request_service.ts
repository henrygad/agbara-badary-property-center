
import { collection, addDoc, query, where, getDocs, serverTimestamp, updateDoc, doc, getDoc } from "firebase/firestore";
import RequestTypes from "@/types/request.types";
import { db } from "./config"
import { formatteFireStoreDate } from "@/utils";


// Fetch all properties
export async function getRequestsDb() {
    const querySnapshot = await getDocs(collection(db, "requests"))
    return querySnapshot.docs.map(doc => {
        const data = formatteFireStoreDate(doc.data());
        return { id: doc.id, ...data };
    }) as RequestTypes[]
}

export async function addNewRequestDb(data: RequestTypes) {
    const { propertyId, clientId,  referenceId} = data;

    const q = query(
        collection(db, "requests"),
        where("propertyId", "==", propertyId),
        where("referenceId", "==", referenceId),
        where("clientId", "==", clientId)
    );

    const snapshot = await getDocs(q);

    // 1) Check for duplication within 24
    if (!snapshot.empty) {
        const data = snapshot.docs[0].data();

        const lastTime = data.createdAt?.toDate?.() || new Date(0);
        const diffHours = (Date.now() - lastTime.getTime()) / (1000 * 60 * 60);
        if (diffHours < 24) return "Exists";
    }

    // 2) Store request in db
    await addDoc(collection(db, "requests"), {
        ...data,
        propertyId,
        clientId,
        status: "pending",
        createdAt: serverTimestamp(),
    });

    return "Success";
}

// Update property by ID
export async function updateRequestDb(id: string, data: Partial<RequestTypes>) {
    try {
        const docRef = doc(db, "requests", id);
        await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });

        const docSnap = await getDoc(docRef);
        let getUpdatedData = docSnap.data()
        if (getUpdatedData) {
            getUpdatedData = formatteFireStoreDate(getUpdatedData);
        }

        return { id: docRef.id, ...getUpdatedData } as RequestTypes;
    } catch (error) {
        console.error("Error updating request:", error);
        throw error;
    }
}
