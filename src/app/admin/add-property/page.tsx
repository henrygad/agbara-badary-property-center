"use client";

import PropertyFormEditor from "@/components/add_property/Index";
import { usePropertyStore } from "@/store/usePropertyStore";
import { PropertyTypes } from "@/types/property.types";
import { useEffect, useState } from "react";

export default function AddProperty() {
    const { setForm } = usePropertyStore();
    const [loadingForm, setLoadingForm] = useState(false);   

    useEffect(() => {        
        // Get duplicated data from localStorage
        // Check if duplicate data is present
        const duplicate = localStorage.getItem("duplicateProperty");

        if (duplicate) {
            setLoadingForm(true);

            const parsed = JSON.parse(duplicate) as PropertyTypes;
            // clear the  UID so it will generate a new one
            parsed.id = "";
            parsed.referenceId = "";

            setTimeout(() => {
                setForm(() => parsed);
                localStorage.removeItem("duplicateProperty");                
                setLoadingForm(false);               
            }, 200);

            // return () => clearTimeout(clearOut);
        } 
    }, [setForm]);

    return <div>
        <PropertyFormEditor
            accountType="ADMIN"
            documentType={"NEW"}
            loadingForm={loadingForm}
            setLoadingForm={setLoadingForm}
        />
    </div>
};
