import ReturnBack from "@/components/ReturnBack";
import { Metadata } from "next";
import ClientProperties from "./ClientProperties";


export async function generateMetadata(): Promise<Metadata> {

  return {
    title: `Properties for Sale & Rent | 1000 plus Listings`,
    description: `Browse 1000 plus properties available for sale or rent in Agbara, Badagry, and surrounding areas. Verified listings and trusted agents.`,
    openGraph: {
      title: `Properties in Agbara & Badagry | 1000 plus Listings`,
      description: `Browse 1000 plus properties for sale or rent along the Agbara–Badagry expressway.`,
      url: "https://agbarabadagrypropertycenter.com/properties",
    },
  };
}


export default function Properties() {
  return (
    <div className="w-full p-2">
      <menu className="w-full mb-4">
        <ReturnBack />
      </menu>
      <ClientProperties />
    </div>
  );
}
