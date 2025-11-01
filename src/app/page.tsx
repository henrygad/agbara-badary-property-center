"use client";

import SearchForm from "../components/SearchForm";
import backgroundimage from "../../public/images/home_hero_image.jpg";
import { Building2, ThumbsUp, Users, Star } from "lucide-react";
import CountUp from "react-countup";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ClientCard from "@/components/property/ClientCard";
import { useMemo } from "react";
import { useClientStore } from "@/store/useClientStore";
import GroundLoader from "@/components/loaders/GroundLoader";


export default function Home() {
  const {  properties, loading } = useClientStore();

  // Filtering logic (including date filter)
  const filteredProperties = useMemo(() => {
    return properties.sort(
      (a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
    )
  }, [properties]);

  return <div className="relative">
    {/* Hero */}
    <section
      className="relative bg-cover bg-center h-[500px] md:rounded-sm"
      style={{ backgroundImage: `url(${typeof backgroundimage === "string" ? backgroundimage : backgroundimage?.src})` }}
    >
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-50 rounded-sm"></div>
      <div className="absolute -top-7 sm:top-0 left-0 right-0 bottom-0 text-white mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center z-20">

        <h1 className="text-4xl md:text-5xl font-bold mb-2">Find Your Dream House</h1>
        <p className="text-lg mb-8">Buy, Rent, or Short let properties with trusted agents.</p>
      </div>
    </section>

    {/* Search form */}
    <section className="w-full flex justify-center -mt-40 px-2 relative z-20">
      <div className="w-full max-w-4xl bg-white p-4 rounded-lg shadow-lg">
        <SearchForm />
      </div>
    </section>

    {/* Statics */}
    <section className="py-16 mt-10 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-red-100 dark:bg-red-900/20 rounded-full p-4 mb-4">
              <Building2 size={30} />
            </div>
            <p className="text-xl font-bold text-text-light dark:text-text-dark">
              <CountUp start={0} end={Number("2500")} duration={5} />+
            </p>
            <p className="text-subtext-light dark:text-subtext-dark">Properties Listed</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-red-100 dark:bg-red-900/20 rounded-full p-4 mb-4">
              <Users size={30} />
            </div>
            <p className="text-xl font-bold text-text-light dark:text-text-dark">
              <CountUp start={0} end={Number("150")} duration={5} />+
            </p>
            <p className="text-subtext-light dark:text-subtext-dark">Verified Agents</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-red-100 dark:bg-red-900/20 rounded-full p-4 mb-4">
              <ThumbsUp size={30} />
            </div>
            <p className="text-xl font-bold text-text-light dark:text-text-dark">
              <CountUp start={0} end={Number("1200")} duration={5} />+
            </p>
            <p className="text-subtext-light dark:text-subtext-dark">Successful Deals</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-red-100 dark:bg-red-900/20 rounded-full p-4 mb-4">
              <Star size={30} />
            </div>
            <p className="text-xl font-bold text-text-light dark:text-text-dark">
              {/* <CountUp start={0} end={Number(4.8/5)} duration={5} />/5 */}
              4.8/5
            </p>
            <p className="text-subtext-light dark:text-subtext-dark">Customer Rating</p>
          </div>
        </div>
      </div>
    </section>

    {/* Your Last Searches */}
    {/* <section className="bg-card-light dark:bg-card-dark py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-center mb-8 text-text-light dark:text-text-dark">Your Last Searches</h2>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md flex justify-between items-center w-full md:w-1/3">
            <div>
              <p className="font-semibold text-text-light dark:text-text-dark">Property for Sale in Nigeria</p>
              <p className="text-sm text-subtext-light dark:text-subtext-dark">3 Bedroom apartment in Agbara area</p>
            </div>
            <a className="text-primary" href="#"><span className="material-icons">arrow_forward</span></a>
          </div>
          <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md flex justify-between items-center w-full md:w-1/3">
            <div>
              <p className="font-semibold text-text-light dark:text-text-dark">Property for Rent in Nigeria</p>
              <p className="text-sm text-subtext-light dark:text-subtext-dark">2 Bedroom flat in Badagry corridor</p>
            </div>
            <a className="text-primary" href="#"><span className="material-icons">arrow_forward</span></a>
          </div>
        </div>
      </div>
    </section> */}

    {/* Featured Real Estate Companies */}
    {/* <section className="bg-background-light dark:bg-background-dark py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-center mb-8 text-text-light dark:text-text-dark">Featured Real Estate Companies</h2>
        <div className="flex flex-wrap justify-center items-center gap-8">
          <div className="bg-card-light dark:bg-card-dark px-6 py-3 rounded-lg shadow-sm">
            <p className="font-medium text-text-light dark:text-text-dark">Blushedge</p>
          </div>
          <div className="bg-card-light dark:bg-card-dark px-6 py-3 rounded-lg shadow-sm">
            <p className="font-medium text-text-light dark:text-text-dark">Jide Taiwo &amp; Co</p>
          </div>
          <div className="bg-card-light dark:bg-card-dark px-6 py-3 rounded-lg shadow-sm">
            <p className="font-medium text-text-light dark:text-text-dark">Property Pro</p>
          </div>
          <div className="bg-card-light dark:bg-card-dark px-6 py-3 rounded-lg shadow-sm">
            <p className="font-medium text-text-light dark:text-text-dark">Estate Link</p>
          </div>
        </div>
      </div>
    </section> */}

    {/* Are you an Agent */}
    <section className="min-h-[400px] flex items-center">
      <div className="mx-auto py-20 px-10 text-center space-y-4">
        <p className="text-xl font-medium text-center">Are you an estate agent? List your property for FREE.</p>
        <Button
          variant="destructive"
          className="bg-primary text-white text-base px-8 py-5 rounded-md font-medium cursor-pointer"
        >
          <Link href="/auth/agent-register" >Get Started</Link>
        </Button>
      </div>
    </section>

    {/* Lasted properties */}
    <section className="py-10 bg-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-text-light dark:text-text-dark">Recently Added</h2>
          <Link
            className="text-primary font-medium text-nowrap whitespace-pre text-sm"
            href="/properties"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {
            !loading && filteredProperties.length ?
              filteredProperties.map((p, idx) => {
                if (idx > 4) {
                  return;
                }
                return <ClientCard key={p.id} property={p} />
              }
              ) :
               <GroundLoader loading={loading} />
          }
        </div>
        <div className="flex justify-end mt-10">
          <Link
            className="text-primary font-medium text-nowrap whitespace-pre text-sm"
            href="/properties"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
    
  </div>
}

