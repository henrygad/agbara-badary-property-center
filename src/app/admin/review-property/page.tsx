"use client";

import PropertyFormEditor from "@/components/add_property/Index";
import { usePropertyStore } from "@/store/usePropertyStore";
import { PropertyTypes } from "@/types/property.types";
import { useEffect, useState } from "react";
import { clearTimeout } from "timers";

export default function ReviewProperty() {
  const { setForm } = usePropertyStore();
  const [loadingForm, setLoadingForm] = useState(false);

  useEffect(() => {
    setLoadingForm(true);

    // Get data to edit from localStorage
    // Check if toEdit data is present
    const review = localStorage.getItem("reviewProperty");

    if (review) {
      const parsed = JSON.parse(review) as PropertyTypes;
      const clearOut = setTimeout(() => {
        setForm(() => parsed);
        localStorage.removeItem("reviewProperty");
        clearTimeout(clearOut);
      }, 200);
    }

    setLoadingForm(false);
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
