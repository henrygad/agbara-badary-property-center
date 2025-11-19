"use client";

import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { formatCurrency, formatDate } from "@/utils";
import { Bath, Toilet, Bed, CalendarDays, Car, Mail, MapPin, Phone, Ruler, User, Sofa, Hammer, Layers, Building2, Briefcase, CarFront, MoreVertical, Clipboard, Flag } from "lucide-react";
import DisplayImage from "@/components/gallery/DisplayImage";
import { PropertyTypes } from "@/types/property.types";
import { Badge } from "@/components/ui/badge";
import Status from "@/components/property/Status";
import Availability from "@/components/property/Availability";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import ImageGallery from "@/components/gallery/ImageGallery";
import RequestForm from "./RequestForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import CustomCard from "../CustomCrad";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { showSuccess } from "../ui/toasts";
import { useRouter } from "next/navigation";

type Props = {
    property: PropertyTypes
    viewer: "ADMIN" | "AGENT" | "CLIENT"
    placeViewing: "PREVIEW" | "CLIENT"
};


export default function Listings({ property, viewer, placeViewing }: Props) {
    const router = useRouter();


    const plugin = useRef(
        Autoplay({
            delay: 8000,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
        })
    );

    const handleReport = async (id?: string) => {
        if (!id) return;
        router.push("/contact");
    };

    const handleCopy = (id?: string) => {
        navigator.clipboard.writeText(`${window.location.origin}/property/${id}`);
        showSuccess("Copied", "Property link copied!");
    };


    return <div className="w-full">
        <Carousel
            opts={{
                align: "start",
                loop: true,
            }}
            plugins={[plugin.current]}
            className="relative min-w-full"
        >
            <div className="absolute top-4 left-4 z-20">
                <div className="flex flex-col gap-2">
                    <Availability placeViewing={placeViewing} availability={property.availability} />
                    {property.status && <Status status={property.status} />}
                    {property.category && <Badge variant="secondary">{property.category}</Badge>}
                    {property.type && <Badge>{property.type}</Badge>}
                </div>
            </div>
            {placeViewing === "CLIENT" &&
                <div className="absolute top-3 right-3 z-20">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="bg-gray-300 rounded-4xl p-1">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            onClick={(e) => e.stopPropagation()}
                            align="end"
                            className="w-40 space-y-4 p-4"
                        >

                            {/* Copy Link */}
                            <DropdownMenuItem
                                onClick={() => handleCopy(property.id)}
                                className="flex gap-2 items-center"
                            >
                                <Clipboard className="w-4 h-4 mr-2 text-agray-text-gray-600" />
                                Copy Link
                            </DropdownMenuItem>
                            {/* Report */}
                            <DropdownMenuItem
                                className="text-primary flex gap-2 items-center"
                                onClick={() => handleReport(property.id)}
                            >
                                <Flag className="w-4 h-4 mr-2 text-agray-text-gray-600" />
                                Report
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            }

            {
                property.images.length ?
                    <CarouselContent className="min-w-full">
                        {property.images.map((image, index) => (
                            <CarouselItem key={index} className="w-full h-[400px] sm:h-[600px] rounded-lg">
                                <DisplayImage
                                    src={image}
                                    alt="propery photo"
                                    className="w-full h-full rounded-lg"
                                    useRemove={false}
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent> :
                    <div className="w-full h-[400px] sm:h-[600px] rounded-lg border"></div>
            }
            <CarouselPrevious type="button" className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/50 p-2 rounded-full hover:bg-white" />
            <CarouselNext type="button" className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/50 p-2 rounded-full hover:bg-white" />
        </Carousel>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-3 md:mt-8 px-1">
            <div className="md:col-span-2">
                {/* Title and price */}
                <h1 className="text-3xl font-bold">{property.title}</h1>
                <div className="mt-2 space-y-2">
                    <div className="flex gap-2 text-base mt-2">
                        <p className="text-primary text-2xl font-semibold">{formatCurrency(property.price)}</p>{property.price && <>/ <span className='text-muted-foreground'>{property.priceFrequency}</span></>}
                    </div>
                    {property.negotiable && <Badge variant="outline" className="text-sm text-primary ">Price is Negotiable</Badge>}
                </div>

                {/* Location */}
                <div className="mt-8">
                    <h2 className="text-xl mb-1 font-semibold">Location</h2>
                    <CustomCard>
                        <div className="p-4 grid sm:grid-cols-2 gap-3">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span className='text-base'>{placeViewing === "PREVIEW" && property.street + ","} {property.area}, {property.city}, {property.state}</span>
                            </div>
                            {property.landmark && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                    <span className='text-base1'>Landmark: {property.landmark}</span>
                                </div>
                            )}
                        </div>
                    </CustomCard>
                </div>

                {/* Description */}
                <div className="space-y-2 mt-8 w-full">
                    <Tabs defaultValue="description" className="w-full">
                        <TabsList className="flex gap-4 text-sm dark:bg-gray-900">
                            <TabsTrigger
                                type="button"
                                value="description"
                                className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:text-white cursor-pointer"
                            >
                                Description
                            </TabsTrigger>
                            <TabsTrigger
                                type="button"
                                value="gallery"
                                className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:text-white cursor-pointer"
                            >
                                Gallery
                            </TabsTrigger>
                            <TabsTrigger
                                type="button"
                                value="virtual-tour"
                                className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:text-white cursor-pointer"
                            >
                                Virtual Tour
                            </TabsTrigger>
                        </TabsList>
                        <ScrollArea className="min-h-[200px] max-h-[300px] overflow-auto w-full">
                            <TabsContent value="description">
                                <p className="text-sm font-normal text-wrap p-2 leading-normal">{property.description}</p>
                            </TabsContent>
                            <TabsContent value="gallery" className="w-full">
                                <ImageGallery images={property.images} title="" />
                            </TabsContent>
                            <TabsContent value="virtual-tour" className="w-full">
                                {property.videoUrl && (
                                    <iframe
                                        src={property.videoUrl}
                                        className="w-full h-[300px] rounded-md"
                                        allowFullScreen
                                    ></iframe>

                                )}
                            </TabsContent>
                        </ScrollArea>
                    </Tabs>
                </div>

                {/* Details */}
                {atLeastOneDetails(property) &&
                    <div className="mt-8">
                        <h2 className="text-xl mb-1 font-semibold">Details</h2>
                        <CustomCard>
                            <div className="p-4 grid sm:grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
                                {property.bedrooms && (
                                    <div className="flex shrink-0 items-center gap-2">
                                        <Bed className="w-4 h-4 text-muted-foreground" />
                                        <span>{property.bedrooms} Bedrooms</span>
                                    </div>
                                )}
                                {property.bathrooms && (
                                    <div className="flex shrink-0 items-center gap-2">
                                        <Bath className="w-4 h-4 text-muted-foreground" />
                                        <span>{property.bathrooms} Bathrooms</span>
                                    </div>
                                )}
                                {property.toilets && (
                                    <div className="flex shrink-0 items-center gap-2">
                                        <Toilet className="w-4 h-4 text-muted-foreground" />
                                        <span>{property.toilets} Toilets</span>
                                    </div>
                                )}
                                {property.parkingSpaces && (
                                    <div className="flex shrink-0 items-center gap-2">
                                        <Car className="w-4 h-4 text-muted-foreground" />
                                        <span>{property.parkingSpaces} Parking spaces</span>
                                    </div>
                                )}
                                {property.size && (
                                    <div className="flex shrink-0 items-center gap-2">
                                        <Ruler className="w-4 h-4 text-muted-foreground" />
                                        <span>{property.size} {property.sizeUnit}</span>
                                    </div>
                                )}
                                {property.furnishing && (
                                    <div className="flex shrink-0 items-center gap-2">
                                        <Sofa className="w-4 h-4 text-muted-foreground" />
                                        <span>{property.furnishing}</span>
                                    </div>
                                )}
                                {property.condition && (
                                    <div className="flex shrink-0 items-center gap-2">
                                        <Hammer className="w-4 h-4 text-muted-foreground" />
                                        <span>{property.condition}</span>
                                    </div>
                                )}

                                {/* Commercial Specific */}
                                <>
                                    {property.floorLevel && (
                                        <div className="flex shrink-0 items-center gap-2">
                                            <Layers className="w-4 h-4 text-muted-foreground" />
                                            <span>{property.floorLevel} Floor level</span>
                                        </div>
                                    )}
                                    {property.totalFloors && (
                                        <div className="flex shrink-0 items-center gap-2">
                                            <Building2 className="w-4 h-4 text-muted-foreground" />
                                            <span>{property.totalFloors} Total floors</span>
                                        </div>
                                    )}
                                    {property.propertyUse && (
                                        <div className="flex shrink-0 items-center gap-2">
                                            <Briefcase className="w-4 h-4 text-muted-foreground" />
                                            <span>{property.propertyUse} Use</span>
                                        </div>
                                    )}

                                    {property.parkingCapacity && (
                                        <div className="flex shrink-0 items-center gap-2">
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
                                </>

                                {property.yearBuilt && (
                                    <div className="flex items-center gap-2">
                                        <CalendarDays className="w-4 h-4 text-muted-foreground" />
                                        <span>Built in {property.yearBuilt}</span>
                                    </div>
                                )}
                            </div>
                        </CustomCard>
                    </div>
                }

                {/*amenities  */}
                {property.amenities?.length ?
                    <div>
                        <h2 className="text-xl mb-1 font-semibold mt-8">Amenities</h2>
                        <CustomCard>
                            <div className="p-4 grid sm:grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
                                {property.amenities.map((a: string, i: number) => (
                                    <Badge key={i} variant="secondary">{a}</Badge>
                                ))}
                            </div>
                        </CustomCard>
                    </div> :
                    null
                }
            </div>

            {/* Fees, Meta Admin view, Meta Client view , Agent details*/}
            <div>
                {/* Fees */}
                <div className="mt-8">
                    <h2 className="text-xl mb-1 font-semibold">Fees</h2>
                    <CustomCard>
                        <div className="p-4 grid lg:grid-cols-3 gap-3">
                            <div>
                                <p className="text-sm text-muted-foreground">Service Charge</p>
                                <p>{formatCurrency(property.serviceCharge) || "0"}</p> {property.serviceCharge && <p>/{property.serviceChargeFrequency}</p>}
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Agency Fee</p>
                                <p>{formatCurrency(property.agencyFee) || "0"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Legal Fee</p>
                                <p>{formatCurrency(property.legalFee) || "0"}</p>
                            </div>
                        </div>
                    </CustomCard>
                </div>

                {/* Meta Admin view */}
                {viewer === "ADMIN" && <div className="mt-8">
                    <h2 className="text-xl mb-1 font-semibold">Metadata</h2>
                    <CustomCard>
                        <div className="p-4 grid lg:grid-cols-2 gap-3">
                            <div>
                                <p className="text-sm text-muted-foreground">Package</p>
                                <p className="text-base">{property.packageType}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Priority Rank</p>
                                <p className="text-base">{property.priorityRank ?? ""}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Views</p>
                                <p className="text-base">{property.views?.length ?? 0}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Reference ID</p>
                                <p className="text-base">{property.referenceId}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Listed On</p>
                                <p className="text-base">{formatDate(property.createdAt).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Last Updated</p>
                                <p className="text-base">{formatDate(property.updatedAt).toLocaleString()}</p>
                            </div>
                        </div>
                    </CustomCard>
                </div>
                }
                {/* Meta Client view */}
                <div className="mt-8">
                    <CustomCard>
                        <div className="p-4 grid sm:grid-cols-2 gap-3">
                            <div>
                                <p className="text-sm text-muted-foreground">Reference ID</p>
                                <p className="text-base">{property.referenceId}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Last Updated</p>
                                <p className="text-base">{formatDate(property.updatedAt).toLocaleString()}</p>
                            </div>
                        </div>
                    </CustomCard>
                </div>

                {/* Agent details */}
                {(placeViewing === "PREVIEW" || viewer === "ADMIN") && <div className="mt-8">
                    <h2 className="text-xl mb-1 font-semibold">Agent</h2>
                    <CustomCard>
                        <div className="p-4 space-y-8">
                            <div className="flex justify-center">
                                <DisplayImage
                                    src={property.agentPhoto || "avata.png"}
                                    useRemove={false}
                                    alt={property.agentName}
                                    className="w-24 h-24 rounded-full border-2 border-primary object-cover"
                                    type="Profile"
                                />
                            </div>
                            <div className="flex flex-wrap justify-evenly items-center gap-3 break-all">
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
                                    <div className="flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-muted-foreground" />
                                        <p>{property.agentCompany}</p>
                                    </div>}
                            </div>
                        </div>
                    </CustomCard>
                </div>}

            </div>

        </div>

        {/* Spacer */}
        <div className="h-10" />
        {
            placeViewing === "CLIENT" && <RequestForm property={property} />
        }
    </div>
};


const atLeastOneDetails = (property: PropertyTypes) => {
    const details = {
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        toilets: property.toilets,
        parkingSpaces: property.parkingSpaces,
        size: property.size,
        furnishing: property.furnishing,
        condition: property.condition,
        floorLevel: property.floorLevel,
        totalFloors: property.totalFloors,
        propertyUse: property.propertyUse,
        parkingCapacity: property.parkingCapacity,
        floorArea: property.floorArea,
        yearBuilt: property.yearBuilt,
    };

    const atLeastOneDetail =
        Object.values({
            ...details
        }).some((val) => (val !== "" && val !== undefined && val !== 0 && val !== null));

    return atLeastOneDetail;
};
