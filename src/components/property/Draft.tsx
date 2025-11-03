"use client";

import DisplayImage from '../gallery/DisplayImage';
import Status from './Status';
import { PropertyTypes } from '@/types/property.types';
import { formatDistanceToNow } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Edit, MoreVertical, Trash2 } from 'lucide-react';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { showSuccess } from '../ui/toasts';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';

export default function Draft({ property, setDrafts }: { property: PropertyTypes, setDrafts: Dispatch<SetStateAction<PropertyTypes[]>> }) {
  const router = useRouter();

  const continueingWriting = (property: PropertyTypes) => {
    localStorage.setItem("draftProperty", JSON.stringify(property));
    // Navigate to editor
    router.push("/admin/add-property");
  };

  const handleDelete = (draftId?: string) => {
    if (!draftId) return;

    const draft = JSON.parse(localStorage.getItem("drafts") || "[]") as PropertyTypes[];
    if (draft.length) {
      localStorage.setItem(
        "drafts",
        JSON.stringify(draft.filter(d => d.draftId !== draftId))
      );
      setDrafts(p => p.filter(d => d.draftId !== draftId));
      showSuccess("Draft Deleted!");
    }

  };

  return <div className='flex justify-between items-center p-3'>
    <div className="flex items-center gap-4">
      <DisplayImage
        className="h-18 w-18 rounded-md object-cover"
        src={property.images[0] || ""}
        alt={property.title}
        useRemove={false}
      />
      <div className="flex flex-col">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">
          {property.title}
        </h3>
        <p className="text-xs text-gray-500">Agent: {property.agentName}</p>

        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            {property.price}
          </p>

          {/*Property Purpose Badge (rent/sell/sold/leased) */}
          <Status status={property.status} />
        </div>

        <p className="text-xs text-gray-400 mt-2">
          {formatDistanceToNow(new Date(property.createdAt || ""), {
            addSuffix: true,
          })}
        </p>
      </div>
    </div>
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          onClick={(e) => e.stopPropagation()}
          align="end"
          className="min-w-40 space-y-4 p-4"
        >
          {/* Edit */}
          <DropdownMenuItem
            className="flex gap-2 items-center"
            onClick={() => continueingWriting(property)}
          >
            <Edit className="w-4 h-4 mr-2 text-gray-600" />
            Continue writing
          </DropdownMenuItem>

          {/* Delete */}
          <DropdownMenuItem
            className="text-primary flex gap-2 items-center"
            onClick={() => handleDelete(property.draftId)}
          >
            <Trash2 className="w-4 h-4 mr-2 text-gray-600" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
};
