"use client";

import ClientCard from '@/components/property/ClientCard'
import { SearchIcon } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import SearchForm from '@/components/SearchForm';
import { useEffect, useState } from 'react';
import { searchPropertiesDb } from '@/lib/firebase/search_service';
import { PropertyTypes } from '@/types/property.types';
import ReturnBack from '@/components/ReturnBack';
import PageLoading from '@/components/loaders/PageLoader';
import ItemNotFound from '@/components/ItemNotFound';

export default function Search() {
  const query = useSearchParams();
  const [openSearchForm, setOpenSearchForm] = useState(false);

  const [results, setResult] = useState<PropertyTypes[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const status = query.get("status");
    const location = query.get("location");
    const type = query.get("type");
    const bedrooms = query.get("bedrooms");
    const toilets = query.get("toilets");
    const minPrice = query.get("minPrice");
    const maxPrice = query.get("maxPrice");
    const furnishing = query.get("furnishing");
    const condition = query.get("condition");
    const category = query.get("category");

    async function fetchSearch() {
      try {

        const ps = await searchPropertiesDb({
          status: status || undefined,
          type: type || undefined,
          bedrooms: bedrooms || undefined,
          toilets: toilets || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          furnishing: furnishing || undefined,
          condition: condition || undefined,
          category: category || undefined,
          location: location || undefined,
        });

        if (ps.length) {
          setResult(ps.filter(p => p.availability === "Accepted"));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }

    }

    if (status) {
      fetchSearch();
    }
  }, [query]);

  if (loading) return <PageLoading loading={loading} />

  return (
    <div className='w-full p-2'>
      <menu className="w-full mb-4">
        <ReturnBack />
      </menu>
      <div className='w-full mb-4'>
        <AlertDialog open={openSearchForm} onOpenChange={setOpenSearchForm}>
          <AlertDialogTrigger asChild>
            <button
              className='w-full py-2.5 px-4 rounded-full flex justify-start items-center gap-4 text-sm bg-gray-100/70'
            >
              <SearchIcon size={20} className='text-slate-800' /> Search...
            </button>
          </AlertDialogTrigger >

          <AlertDialogContent className='w-full max-w-none' style={{ maxWidth: "95%" }}>
            <AlertDialogTitle className='hidden'></AlertDialogTitle>
            <SearchForm open={openSearchForm} setOpen={setOpenSearchForm} />           
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
            <p className='text-xs text-muted-foreground'>Found {results.length} properties</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {
              results?.length ?
                results.map((p) =>
                  <ClientCard key={p.id} property={p} />
                ) :
                <div className='col-span-3'>
                  <ItemNotFound>No property found</ItemNotFound>
                </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
};


