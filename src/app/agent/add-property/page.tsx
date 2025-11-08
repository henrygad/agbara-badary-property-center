"use client";

import PropertyFormEditor from "@/components/add_property_form/Index";
import { usePropertyStore } from "@/store/usePropertyStore";
import { PropertyTypes } from "@/types/property.types";
import { useEffect, useState } from "react";

export default function AddProperty() {
    const { setForm } = usePropertyStore();
    const [loadingForm, setLoadingForm] = useState(false);   

    useEffect(() => {        
        // Get duplicated data in localStorage        
        const duplicate = localStorage.getItem("duplicateProperty");

        // Get drafted data in localStorage 
        const draft = localStorage.getItem("draftProperty");

        setLoadingForm(true);

        if (duplicate) {

            const parsed = JSON.parse(duplicate) as PropertyTypes;
            // clear the  UID so it will generate a new one
            parsed.id = "";
            parsed.referenceId = "";

            setTimeout(() => {
                setForm(() => parsed);
                localStorage.removeItem("duplicateProperty");                
            }, 200);
            
            // return () => clearTimeout(clearOut);
        } else if (draft) {
            const parsed = JSON.parse(draft) as PropertyTypes;                              
            parsed.createdAt = undefined;
            parsed.updatedAt = undefined;

            setTimeout(() => {
                setForm(() => parsed);
                localStorage.removeItem("draftProperty");
            }, 200);
        }
        
        
        setLoadingForm(false);               

    }, [setForm]);

    return <div>
        <PropertyFormEditor
            accountType="AGENT"
            documentType={"NEW"}
            loadingForm={loadingForm}
            setLoadingForm={setLoadingForm}
        />
    </div>
};
