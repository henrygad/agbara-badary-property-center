"use client";

import PropertyFormEditor from "@/components/add_property/Index";
import { usePropertyStore } from "@/store/usePropertyStore";
import { PropertyTypes } from "@/types/property.types";
import { useEffect, useState } from "react";
import { clearTimeout } from "timers";

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

            const clearOut = setTimeout(() => {
                setForm(() => parsed);
                localStorage.removeItem("duplicateProperty");                
                setLoadingForm(false);
                clearTimeout(clearOut);
            }, 200);
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
