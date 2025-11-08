"use client";

import ItemNotFound from "@/components/ItemNotFound";
import Draft from "@/components/property/Draft";
import { PropertyTypes } from "@/types/property.types"
import { useEffect, useState } from "react"


export default function Drafts() {
  const [drafts, setDrafts] = useState<PropertyTypes[]>([]);


  useEffect(() => {
    const drafts = JSON.parse(
      localStorage.getItem("drafts") || "[]"
    ) as PropertyTypes[]

    setDrafts(drafts);
  }, []);

  return (
    <div className='w-full'>
      <div className="space-y-4 p-4">
        {
          drafts.length ?
            drafts.map((d) =>
              <div key={d.draftId} className="border rounded-md">
                <Draft property={d} setDrafts={setDrafts} />
              </div>
            ) :            
            <ItemNotFound>No draft</ItemNotFound>
        }
      </div>
    </div>
  )
}
