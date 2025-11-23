import ReturnBack from "@/components/ReturnBack";
import { getPropertyByIdDb } from "@/lib/firebase/property_service";
import ClientProperty from "./ClientProperty";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {  
  const { id } = await params;
  const property = await getPropertyByIdDb(id);

  if (!property) {
    return { title: "Property Not Found" };
  }

  return {
    title: `${property.title} | ${property.type} in ${property.city}, ${property.state}`,
    description: `Explore ${property.bedrooms}-bedroom ${property.type} for sale or rent in ${property.city}, ${property.state}. Price: ${property.price}`,
    openGraph: {
      title: `${property.title} | ${property.type} in ${property.city}, ${property.state}`,
      description: `Explore ${property.bedrooms}-bedroom ${property.type} for sale or rent in ${property.city}, ${property.state}.`,
      url: `https://agbarabadagrypropertycenter.com/properties/${property.id}`,
      images: [
        {
          url: property.images[0],
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
    },
  };
}

// Server component page
export default function Page() {
  return (
    <div className="w-full p-2">
      <menu className="w-full mb-4">
        <ReturnBack />
      </menu>
      <ClientProperty />
    </div>
  );
}
