"use client";

import { PropertyTypes } from "@/types/property.types";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { formatCurrency, formatDate } from "@/utils";
import ShortView from "./ClientCard";
import { Card, CardContent } from "../ui/card";
import { Bath, Bed, Building2, CalendarDays, Car, Mail, MapPin, Phone, Ruler, User } from "lucide-react";
import { Badge } from "../ui/badge";
import SendRequest from "./SendRequest";
import DisplayImage from "../gallery/DisplayImage";


type Props = {
    property: PropertyTypes
    showFull: boolean
    viewer: "ADMIN" | "AGENT" | "CLIENT"
    placeViewing: "PREVIEW" | "CLIENT"
};

export default function Property({ property, showFull, placeViewing }: Props) {

    if (!showFull) {
        return <ShortView />
    }

    return <div className="space-y-8">
        {/* HEADER */}
        <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
                <Building2 className="w-5 h-5 text-muted-foreground" />
                {property.title}
            </h1>
            <p className="text-sm text-muted-foreground">
                Reference ID: <span className="font-medium">{property.referenceId}</span>
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="secondary">{property.category}</Badge>
                <Badge>{property.type}</Badge>

                <Badge
                    className={
                        property.status === "Rent"
                            ? "bg-blue-100 text-blue-800"
                            : property.status === "Sale"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                    }
                >
                    {property.status}
                </Badge>

                <Badge
                    className={
                        property.availability === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : property.availability === "Accepted"
                                ? "bg-green-100 text-green-800"
                                : property.availability === "Rejected"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                    }
                >
                    {property.availability}
                </Badge>
            </div>
        </div>

        {/* IMAGE CAROUSEL */}
        <Card>
            <CardContent className="p-4">
                <Carousel className="w-full">
                    <CarouselContent>
                        {property.images?.map((img: string, idx: number) => (
                            <CarouselItem key={idx}>
                                <DisplayImage
                                    className="w-full h-[400px] object-cover rounded-md"
                                    src={img}
                                    alt={property.title}
                                    useRemove={false}
                                />                               
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>

                {/* Optional Video / Virtual Tour */}
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

                {property.virtualTourUrl && (
                    <div className="mt-4">
                        <h3 className="font-medium mb-2">Virtual Tour</h3>
                        <iframe
                            src={property.virtualTourUrl}
                            className="w-full h-[400px] rounded-md"
                            allowFullScreen
                        ></iframe>
                    </div>
                )}
            </CardContent>
        </Card>

        {/* LOCATION */}
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

        {/* PRICING */}
        <Card>
            <CardContent className="p-4 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="text-lg font-semibold">
                        ₦{formatCurrency(property.price)} / {property.priceFrequency}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Service Charge</p>
                    <p>₦{formatCurrency(property.serviceCharge) || "—"}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Agency Fee</p>
                    <p>₦{formatCurrency(property.agencyFee) || "—"}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Legal Fee</p>
                    <p>₦{formatCurrency(property.legalFee) || "—"}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Negotiable</p>
                    <p>{property.negotiable ? "Yes" : "No"}</p>
                </div>
            </CardContent>
        </Card>

        {/* DETAILS */}
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
                {property.yearBuilt && (
                    <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-muted-foreground" />
                        <span>Built in {property.yearBuilt}</span>
                    </div>
                )}
            </CardContent>
        </Card>

        {/* AMENITIES */}
        <Card>
            <CardContent className="p-4">
                <h3 className="font-medium mb-2">Amenities</h3>
                {property.amenities?.length ? (
                    <div className="flex flex-wrap gap-2">
                        {property.amenities.map((a: string, i: number) => (
                            <Badge key={i} variant="secondary">{a}</Badge>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-sm">No amenities listed</p>
                )}
            </CardContent>
        </Card>

        {/* AGENT INFO */}
        <Card>
            <CardContent className="p-4 space-y-2">
                <h3 className="font-medium mb-2">Agent Information</h3>
                <div className="grid sm:grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>{property.agentName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{property.agentPhone || "—"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{property.agentEmail}</span>
                    </div>
                    {property.agentCompany && (
                        <div>
                            <p className="text-sm text-muted-foreground">Company</p>
                            <p>{property.agentCompany}</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>

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
                    <p className="text-sm text-muted-foreground">Created At</p>
                    <p>{formatDate(property.createdAt).toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p>{formatDate(property.updatedAt).toLocaleString()}</p>
                </div>
            </CardContent>
        </Card>
        {/* Request form */}
        {
            placeViewing === "CLIENT" &&
            <SendRequest
                property={property}
            />
        }
    </div>
};

