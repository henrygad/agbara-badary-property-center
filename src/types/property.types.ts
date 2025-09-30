export type Amenity =
    | "Parking"
    | "Borehole"
    | "Generator"
    | "CCTV"
    | "Gated Estate"
    | "Swimming Pool"
    | "Garden"
    | "Balcony"
    | "Fitted Kitchen"
    | "Air Conditioning"
    | "Wardrobes"
    | "Water Heater"
    | "Playground"
    | "Electric Fence"
    | "Street Light"
    | "Security Guard"
    | "Prepaid Meter"
    | "Good Road Access"
    | "Borehole Water"
    | "Fenced"
    | "Secure Area"

export type Status = "-" | "For Sale" | "For Rent" | "Short Let" | "Sold" | "Rented";
export type PackageType = "-" | "Free" | "Featured" | "Premium";
export type Furnishing = "-" | "Furnished" | "Semi-Furnished" | "Unfurnished";
export type Condition = "-" | "New" | "Renovated" | "Fairly Used" | "Needs Renovation";
export type PropertyCategory = "-" | "Residential" | "Commercial" | "Land" | "Short Let";
export type SizeUnit = "sqm" | "sqft" | "plots" | "acres";
export type PriceFrequency = "-" | "Per Month" | "Per Year" | "Per Day" | "Total";
export type PropertyType =
    "-"
    | "Flat"
    | "House"
    | "Duplex"
    | "Bungalow"
    | "Shop"
    | "Office"
    | "Warehouse"
    | "Hotel"
    | "Land"
    | "Other";
export type Availability = "Draft" | "Pending" | "Review" | "Published" | "unPublished" | "Reject";

export interface PropertyTypes {
    id?: string; // UUID
    // Basic Info
    title: string;
    description: string;
    category: PropertyCategory;
    type: PropertyType;
    status: Status;

    // Location
    state: string;
    city: string;
    area: string;
    street: string;
    landmark?: string;
    latitude?: number;
    longitude?: number;

    // Pricing
    price: number;
    priceFrequency: PriceFrequency;
    serviceCharge?: number;
    agencyFee?: number;
    legalFee?: number;
    negotiable: boolean;
    currency: "NGN",

    // Property Details
    bedrooms?: number;
    bathrooms?: number;
    toilets?: number;
    parkingSpaces?: number;
    furnishing: Furnishing;
    condition: Condition;
    yearBuilt?: number;
    size?: number;
    sizeUnit?: SizeUnit;

    floorNumber?: number;
    totalFloors?: number;
    floorLevel?: string;
    propertyUse?: string

    // Amenities
    amenities: string[];

    // Mediaffffff
    images: string[];
    videoUrl?: string;
    virtualTourUrl?: string;

    // Commercial Specific
    commercialType?: string;
    floorArea?: number;
    parkingCapacity?: number,
    powerSupplyNotes?: string

    // Agent Info
    agentName: string;
    agentPhone: number;
    agentEmail: string;
    agentCompany?: string;
    showContact: boolean

    // Meta / Listing Management
    availability: Availability;
    referenceId: string;
    seoSlug: string,
    packageType: PackageType;    
    priorityRank: number
    createdAt: Date | string;   // ISO string
    updatedAt: Date | string;  // ISO string
}
