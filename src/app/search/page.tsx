"use client";

import ClientCard from '@/components/property/ClientCard'
import { sampleProperties } from '@/data/property'
import { ChevronLeft, SearchIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  AlertDialog,  
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import SearchForm from '@/components/SearchForm';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';

export default function Search() {
  const router = useRouter();
  const [openSearchForm, setOpenSearchForm] = useState(false);

  return (
    <div className='w-full p-2'>
      <menu className="w-full mb-4">
        <button
          className="text-primary font-medium text-nowrap whitespace-pre flex items-center"
          onClick={() => router.back()}
        >
          <ChevronLeft size={30} /> Return back
        </button>
      </menu>
      <div className='w-full mb-4'>
        <AlertDialog open={openSearchForm} onOpenChange={setOpenSearchForm}>
          <AlertDialogTrigger asChild>
            <button
              className='w-full py-2.5 px-4 rounded-full flex justify-start items-center gap-4 text-sm bg-gray-100/70'
            >
              <SearchIcon size={20} className='text-slate-800' /> Search properties...
            </button>
          </AlertDialogTrigger >

          <AlertDialogContent className='w-full'>
            <AlertDialogTitle className='hidden'></AlertDialogTitle>

            <ScrollArea className='w-full max-h-[480px] md:max-h-full overflow-y-auto overflow-x-hidden'>
              <SearchForm open={openSearchForm} setOpen={setOpenSearchForm} />
            </ScrollArea>

            <AlertDialogFooter>
              <AlertDialogCancel type='button'>Close</AlertDialogCancel>              
            </AlertDialogFooter>

          </AlertDialogContent>

        </AlertDialog>
      </div>
      <div className="py-10 bg-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">

          <div className="space-y-1 mb-8">
            <h2 className="text-2xl font-bold">
              Search Result
            </h2>
            <p className='text-xs text-muted-foreground'>Found 248 properties</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {
              sampleProperties?.length ?
                sampleProperties.map((p) =>
                  <ClientCard key={p.id} property={p} />
                ) :
                <div>loading</div>
            }
          </div>
        </div>
      </div>
    </div>
  )
};


