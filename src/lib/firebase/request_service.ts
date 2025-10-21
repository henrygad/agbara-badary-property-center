// lib/submitRequest.ts
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import RequestTypes from "@/types/request.types";
import { db } from "./config"

export async function createNewRequestDb(data: RequestTypes) {
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
        const last = snapshot.docs[0].data();
        const lastTime = last.createdAt?.toDate?.() || new Date(0);
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
