"use client";

import ItemNotFound from "@/components/ItemNotFound";
import TableDisplay from "@/components/property/TableDisplay";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { showSuccess } from "@/components/ui/toasts";
import { useDraftStore } from "@/store/useDraftStore";
import { PropertyTypes } from "@/types/property.types"
import { X } from "lucide-react";
import { useState } from "react"


export default function Drafts() {
  const { drafts, deleteDraft } = useDraftStore();

  const [selected, setSelected] = useState<string[]>([]);

  const allChecked = selected.length === drafts.length;

  const toggleSelectAll = () => {
    if (allChecked) setSelected([])

    else {
      setSelected(drafts.map(p => p.draftId || ""));      
    }
  };

  const toggleSelect = (draftId: string) => {
    setSelected((pre) =>
      pre.includes(draftId) ? pre.filter(s => s !== draftId) : [...pre, draftId]
    );    
  };

  const handleDelete = (draftId?: string) => {
    if (!draftId) return;

    const draft = JSON.parse(localStorage.getItem("drafts") || "[]") as PropertyTypes[];
    if (draft.length) {
      localStorage.setItem(
        "drafts",
        JSON.stringify(draft.filter(d => d.draftId !== draftId))
      );
      deleteDraft(draftId);
    }

  };

  const deleteAll = async () => {
    await Promise.all(selected.map((s) => handleDelete(s)));
    showSuccess("Draft Deleted!");
  };


  return (
    <div className='w-full'>
      {selected.length > 0 &&
        <div className="flex justify-between items-center shadow w-full p-3 mb-4">
          <Button
            variant="ghost"
            onClick={() => setSelected([])}
          >
            <X size={20} />
          </Button>
          <div className="flex-1 flex justify-end gap-3 flex-wrap items-center">
            <Button
              variant="destructive"
              size="sm"
              onClick={deleteAll}
            >
              Delete all
            </Button>
          </div>
        </div>
      }
      <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-900">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th>
                <Checkbox
                  checked={allChecked}
                  onCheckedChange={toggleSelectAll}
                />
              </th>
              <th className="px-4 py-3 text-left text-nowrap whitespace-pre">Property Details</th>
              <th className="px-4 py-3 text-left text-nowrap whitespace-pre">Availability</th>
              <th className="px-4 py-3 text-left text-nowrap whitespace-pre">Location</th>
              <th className="px-4 py-3 text-left text-nowrap whitespace-pre">Last Updated</th>
              <th className="px-4 py-3 text-right text-nowrap whitespace-pre">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drafts.length > 0 ? (
              drafts.map((p) => (
                <TableDisplay
                  key={p.draftId}
                  p={p}
                  selected={selected}
                  setSelected={toggleSelect}
                  placeViewing={"Draft"}
                />
              ))
            ) : (
              <tr>
                <td colSpan={6}>
                  <ItemNotFound>No darfts yet.</ItemNotFound>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
