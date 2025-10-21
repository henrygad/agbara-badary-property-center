import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./config";
import UserTypes from "@/types/user.types";

// Fetch admin data
export const getAdminDb = async () => {
    const adminRef = doc(db, "admin", "profile");
    const snapshot = await getDoc(adminRef);

    if (!snapshot.exists()) {
        throw new Error("Admin profile not found");
    }
    return snapshot.data() as UserTypes;
};

export const createAdminDb = async (adminData: UserTypes) => {
    // use a fixed doc ID, so it’s always one admin object
    const adminRef = doc(db, "admin", "profile");
    await setDoc(adminRef, adminData);
    return await getAdminDb();
};


export const updateAdminDb = async (updatedData: Partial<UserTypes>) => {
    const adminRef = doc(db, "admin", "profile");
    await updateDoc(adminRef, updatedData);
    return await getAdminDb();
};
