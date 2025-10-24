"use client";

import { useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { formatCurrency, formatDate } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bath, Toilet, Bed, CalendarDays, Car, Mail, MapPin, Phone, Ruler, User, Sofa, Hammer, Layers, Building2, Briefcase, CarFront } from "lucide-react";
import DisplayImage from "@/components/gallery/DisplayImage";
import { cn } from "@/lib/utils";
import { PropertyTypes } from "@/types/property.types";
import { Badge } from "@/components/ui/badge";
import Status from "@/components/property/Status";
import Availability from "@/components/property/Availability";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import ImageGallery from "@/components/gallery/ImageGallery";



type Props = {
  property: PropertyTypes
  showFull: boolean
  viewer: "ADMIN" | "AGENT" | "CLIENT"
  placeViewing: "PREVIEW" | "CLIENT"
};


export default function Listings({ property, showFull, placeViewing }: Props) {
  const plugin = useRef(
    Autoplay({
      delay: 8000,             // time between slides
      stopOnInteraction: false, // keep playing even if user clicks
      stopOnMouseEnter: true,   // pause when hovering
    })
  );
  const [tab, setTab] = useState(1);


  return <div>
    {/* Carousel slider */}
    <Carousel
      opts={{
        align: "start",
        loop: true,  
      }}
      plugins={[plugin.current]}
      className="relative w-full flex"
    >
      <div className="absolute top-4 left-4 flex space-x-2 z-50">
        <Badge variant="secondary">{property.category}</Badge>
        <Badge>{property.type}</Badge>
        <Status status={property.status} />
        <Availability availability={property.availability} />
      </div>

      <CarouselContent className="fle-1 flex">
        {property.images.length ?
          property.images.map((image, index) => (
            <CarouselItem key={index} className="flex">
              <Image
                src={image}
                alt="Living room with a view of the city"
                className="w-full h-[400px] sm:h-[500px] object-cover rounded-lg"
                width={800}
                height={600}
              />
            </CarouselItem>
          )) :
          <CarouselItem className="flex">
            <div className="w-full h-[400px] sm:h-[500px] object-cover rounded-lg bg-gray-200" />
          </CarouselItem>
        }
      </CarouselContent>
      <CarouselPrevious className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/50 p-2 rounded-full hover:bg-white" />
      <CarouselNext className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/50 p-2 rounded-full hover:bg-white" />
    </Carousel>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-3 md:mt-8 px-1">
      <div className="md:col-span-2">

        <div>

          {/* Title and price */}
          <h1 className="text-3xl font-bold">{property.title}</h1>
          <div>
            <span className="block text-2xl font-bold mt-2">
              <p className="text-primary">{formatCurrency(property.price)}</p> / {property.priceFrequency}
            </span>
            <span className="block">
              <p className="text-sm text-muted-foreground">Negotiable</p>
              <p>{property.negotiable ? "Yes" : "No"}</p>
            </span>
          </div>

          {/* Location */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold">Location</h2>
            <Card>
              <CardContent className="p-4 grid sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{property.street}, {property.area}, {property.city}, {property.state}</span>
                </div>
                {property.landmark && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>Landmark: {property.landmark}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>


          {/* description */}
          <div className="space-y-6 mt-8">
            <TabNavs t={tab} setT={setTab} />
            <Tabs t={tab} property={property} />
          </div>


          {/* Details */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold">Details</h2>
            <Card>
              <CardContent className="p-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {property.bedrooms && (
                  <div className="flex items-center gap-2">
                    <Bed className="w-4 h-4 text-muted-foreground" />
                    <span>{property.bedrooms} Bedrooms</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-2">
                    <Bath className="w-4 h-4 text-muted-foreground" />
                    <span>{property.bathrooms} Bathrooms</span>
                  </div>
                )}
                {property.toilets && (
                  <div className="flex items-center gap-2">
                    <Toilet className="w-4 h-4 text-muted-foreground" />
                    <span>{property.toilets} Bathrooms</span>
                  </div>
                )}
                {property.parkingSpaces && (
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-muted-foreground" />
                    <span>{property.parkingSpaces} Parking spaces</span>
                  </div>
                )}
                {property.size && (
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-muted-foreground" />
                    <span>{property.size} {property.sizeUnit}</span>
                  </div>
                )}
                {property.furnishing && (
                  <div className="flex items-center gap-2">
                    <Sofa className="w-4 h-4 text-muted-foreground" />
                    <span>{property.furnishing}</span>
                  </div>
                )}
                {property.condition && (
                  <div className="flex items-center gap-2">
                    <Hammer className="w-4 h-4 text-muted-foreground" />
                    <span>{property.condition}</span>
                  </div>
                )}

                {/* Commercial Specific */}
                <div className="md:col-span-2 lg:col-span-4 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <h2 className="text-lg font-semibold">Commercial Details</h2>

                  {property.floorLevel && (
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-muted-foreground" />
                      <span>{property.floorLevel} Floor level</span>
                    </div>
                  )}
                  {property.totalFloors && (
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span>{property.totalFloors} Total floors</span>
                    </div>
                  )}
                  {property.propertyUse && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <span>{property.propertyUse} Use</span>
                    </div>
                  )}

                  {property.parkingCapacity && (
                    <div className="flex items-center gap-2">
                      <CarFront className="w-4 h-4 text-muted-foreground" />
                      <span>{property.parkingCapacity} Parking capacity</span>
                    </div>
                  )}
                  {property.floorArea && (
                    <div className="flex items-center gap-2">
                      <Ruler className="w-4 h-4 text-muted-foreground" />
                      <span>{property.floorArea} Floor area</span>
                    </div>
                  )}
                </div>

                {property.yearBuilt && (
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-muted-foreground" />
                    <span>Built in {property.yearBuilt}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>


          {/*amenities  */}
          {property.amenities?.length &&
            <div>
              <h2 className="text-xl font-semibold mt-8">Amenities</h2>
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((a: string, i: number) => (
                      <Badge key={i} variant="secondary">{a}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          }
        </div>

        {/* Fees */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Fees</h2>
          <Card>
            <CardContent className="p-4 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Service Charge</p>
                <p>₦{formatCurrency(property.serviceCharge) || "0"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Agency Fee</p>
                <p>₦{formatCurrency(property.agencyFee) || "0"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Legal Fee</p>
                <p>₦{formatCurrency(property.legalFee) || "0"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* META */}
        <Card>
          <CardContent className="p-4 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Package</p>
              <p>{property.packageType}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Priority Rank</p>
              <p>{property.priorityRank ?? "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Views</p>
              <p>{property.views?.length ?? 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Reference ID: <span className="font-medium">{property.referenceId}</span>
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Listed On</p>
              <p>{formatDate(property.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p>{formatDate(property.updatedAt).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Agent details */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <h3 className="font-medium mb-2">Agent Information</h3>
          <div className="flex justify-center">
            <DisplayImage
              src={property.agentPhoto || ""}
              useRemove={false}
              alt={property.agentName}
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span>{property.agentName}</span>
            </div>
            {property.agentPhone &&
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{property.agentPhone}</span>
              </div>}
            {property.agentEmail &&
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{property.agentEmail}</span>
              </div>}
            {property.agentCompany &&
              <div>
                <p className="text-sm text-muted-foreground">Company</p>
                <p>{property.agentCompany}</p>
              </div>}
          </div>
        </CardContent>
      </Card>

    </div>

    <div className="sticky bottom-4 left-0 top-0 right-0">
      <div className="w-full h-full flex justify-center">
        <Button
          className="flex-1 bg-primary text-white px-8 py-5 text-sm font-medium rounded-md hover:bg-red-600 cursor-pointer">
          Send Request
        </Button>
      </div>
    </div>
  </div>
}

function Tabs({ t, property }: { t: number, property: PropertyTypes }) {

  if (t === 1) {
    /* Description */
    return <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
      <p className="p-1">{property.description}</p>
    </ScrollArea>
  } else if (t === 2) {
    /* Images */
    return <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        <ImageGallery images={property.images} title="" />
      </div>
    </div>
  } else if (t === 3) {
    /* video */
    return <>
      {property.videoUrl && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">Video Tour</h3>
          <iframe
            src={property.videoUrl}
            className="w-full h-[400px] rounded-md"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </>
  }

  return <div>
    <p>This stunning 3-bedroom luxury apartment offers modern living at its finest in the heart of Lekki Phase 1. Featuring floor-to-ceiling windows that flood the space with natural light, prepare to be mesmerized by the breathtaking panoramic views of the Lagos skyline.</p>
    <p>The open-plan living area seamlessly connects to a gourmet kitchen equipped with top-of-the-line appliances and marble countertops. Each bedroom features an en-suite bathroom with luxury fixtures, while the master suite includes a walk-in closet and private balcony.</p>
    <a className="text-primary font-semibold hover:underline" href="#">Read More</a>
  </div>
}

function TabNavs({ t, setT }: { t: number, setT: (t: number) => void }) {
  const navs = [
    "Description",
    "Images",
    "Virtual Tour"
  ];


  return <nav className="flex gap-3 border-b border-gray-200">
    {
      navs.map((n, idx) =>
        <button
          key={n}
          className={cn("py-4 px-1 border-b-2", t === idx ? "border-primary text-primary font-semibold" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 font-normal")}
          onClick={() => setT(idx + 1)}
        >
          {n}
        </button>
      )
    }
  </nav>

}



/* 

<div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg ">
          <img alt="2-Bedroom Apartment" className="w-full h-56 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBv0X4ycvh9KTbnJXLIB60TyZ9t7wB0nWSFp6faWwWF-tICqg85nhLKdhDGBPRoU0h2UEiHBhwm_wH3kQKa2a1XL5s3Eg82msdWViml2Lncme8xlEkaD3rwpWeGpBzBGufdUAzM7icu0Zy7zDMJq121MMSImRvCVugKm5o4AxaiLgyJRiYRMwSNRJSAJ6uD5yLeJgHkntqQeLFHm7sLFW2i6t7GEQFM3MkNGtE1g7x-t-MGnZvwPpGgc3b4BPHgX3oyFvd17jLTcPE" />
          <div className="p-4">
            <h3 className="font-semibold text-lg">2-Bedroom Apartment</h3>
            <p className="text-primary font-bold mt-1">45,000,000</p>
            <p className="text-sm text-gray-500 mt-1">Victoria Island, Lagos</p>
            <a className="text-primary font-semibold mt-2 inline-block" href="#">View Details</a>
          </div>
        </div>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg ">
          <img alt="4-Bedroom Penthouse" className="w-full h-56 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfmgqPrI8LYqpPV7j8vEohhGMAJ3nK5jTwO_1PBZZNvESM2vLX_jIrJjgDwIv2wilNUbw2egK8FA_hDuhBsQbLx9V0RVdseXM_zTzO4X3owGVLbDCL73AMcSWia-JDh1XTC-2NIhEVzeytjN7u9mRwy64Zcz-PxrC61xrWGq5B_hhBIcGHygyly5UpcMvyejP2Q-HUhTIDOrLeDzYO0My-Qy1yP1rpoUhYWeDoTeTc7N9aUtSdpbMkyY_v-jKIFR6Jpbj0RvEDvww" />
          <div className="p-4">
            <h3 className="font-semibold text-lg">4-Bedroom Penthouse</h3>
            <p className="text-primary font-bold mt-1">95,000,000</p>
            <p className="text-sm text-gray-500 mt-1">Ikoyi, Lagos</p>
            <a className="text-primary font-semibold mt-2 inline-block" href="#">View Details</a>
          </div>
        </div>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg ">
          <img alt="3-Bedroom Apartment" className="w-full h-56 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuApP6OicHrMh1EG9soRZlsJt1UHDLWrZa7zq_ZIA0XEXAOO6OpD4NbZnAz7Bym5qPlyugUxWpQ61rJgr81TW8KZ4RO5sUJtgJJf4LU-1PC18mBsV0FM03xt58eIq4dEu-7hweU7I8lHGINOthJBnT_142NLjsUsS_VnNa5_X4OmhVfRgyqXXYHsHVBaSWm4flnW7xgKBsnn5rknwzp_Bs-2LZYh5dAHcgi1P7k-yzrOuGaO52gFb6luPHqXp7Yo8yM2DKIcv18fSC4" />
          <div className="p-4">
            <h3 className="font-semibold text-lg">3-Bedroom Apartment</h3>
            <p className="text-primary font-bold mt-1">58,000,000</p>
            <p className="text-sm text-gray-500 mt-1">Lekki Phase 1, Lagos</p>
            <a className="text-primary font-semibold mt-2 inline-block" href="#">View Details</a>
          </div>
        </div>
      </div>
    </div>


*/