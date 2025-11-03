"use client";

import PropertyFormEditor from "@/components/add_property_form/Index";
import { usePropertyStore } from "@/store/usePropertyStore";
import { PropertyTypes } from "@/types/property.types";
import { useEffect, useState } from "react";

export default function ReviewProperty() {
  const { setForm } = usePropertyStore();
  const [loadingForm, setLoadingForm] = useState(false);

  useEffect(() => {    

    // Get data to edit from localStorage
    // Check if toEdit data is present
    const review = localStorage.getItem("reviewProperty");

    if (review) {
      setLoadingForm(true);

      const parsed = JSON.parse(review) as PropertyTypes;

      setTimeout(() => {
        setForm(() => parsed);
        localStorage.removeItem("reviewProperty");        
        setLoadingForm(false);        
      }, 200);

    //  return () => clearTimeout(clearOut);
    }

  }, [setForm]);

  return <div>
    <PropertyFormEditor
      accountType="ADMIN"
      documentType="REVIEW"
      loadingForm={loadingForm}
      setLoadingForm={setLoadingForm}
    />
  </div>
};
