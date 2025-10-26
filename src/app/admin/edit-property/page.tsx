"use client";

import PropertyFormEditor from "@/components/add_property/Index";
import { usePropertyStore } from "@/store/usePropertyStore";
import { PropertyTypes } from "@/types/property.types";
import { useEffect, useState } from "react";

export default function EditProperty() {
  const { setForm } = usePropertyStore();
  const [loadingForm, setLoadingForm] = useState(false);

  useEffect(() => {
    
    // Get data to edit from localStorage
    // Check if toEdit data is present
    const update = localStorage.getItem("updateProperty");
    
    if (update) {
      setLoadingForm(true);

      const parsed = JSON.parse(update) as PropertyTypes;
      
       setTimeout(() => {
        setForm(() => parsed);
        localStorage.removeItem("updateProperty");        
        setLoadingForm(false);
      }, 200);

      // return () => clearTimeout(clearOut);
    }

    }, [setForm]);

  return <div>
    <PropertyFormEditor
      accountType="ADMIN"
      documentType="UPDATE"
      loadingForm={loadingForm}
      setLoadingForm={setLoadingForm}
    />
  </div>
};
