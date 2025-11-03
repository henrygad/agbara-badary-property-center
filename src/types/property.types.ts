export type Amenity =
    | "Parking Space"
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
    | "Internet Access"
    | "Electricity"

export type Status = "" | "Sale" | "Rent" | "Lease" | "Sold" | "Rented" | "Leased" | "Short Let";
export type PackageType = "Free" | "Featured" | "Premium";
export type Furnishing = "" | "Furnished" | "Semi-Furnished" | "Unfurnished";
export type Condition = "" | "New" | "Renovated" | "Fairly Used" | "Needs Renovation";
export type PropertyCategory = "" | "Residential" | "Commercial" | "Land" | "Short Let";
export type SizeUnit = "sqm" | "sqft" | "plots" | "acres";
export type PriceFrequency = "Monthly" | "Yearly" | "Daily" | "Total";
export type PropertyType =
    ""
    | "Flat"
    | "House"
    | "Duplex"
    | "Bungalow"
    | "Terraced"
    | "Semidetached"
    | "Detached"
    | "Shop"
    | "Office"
    | "Warehouse"
    | "Hotel"
    | "Plot"
    | "Short Let"
    | "Other";

export type Availability =  "Pending" | "Reviewing" | "Accepted" | "Trash" | "Rejected";

export interface PropertyTypes {
    id?: string; // Fire strore iD
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
    latitude?: number | null;
    longitude?: number | null;

    // Pricing
    price: number | null;
    priceFrequency: PriceFrequency;
    serviceCharge?: number | null;
    serviceChargeFrequency?: PriceFrequency;
    agencyFee?: number | null;
    legalFee?: number | null;
    negotiable: boolean;
    currency: "NGN",

    // Property Details
    bedrooms?: number | null;
    bathrooms?: number | null;
    toilets?: number | null;
    parkingSpaces?: number | null;
    furnishing: Furnishing;
    condition: Condition;
    yearBuilt?: number | null;
    size?: number | null;
    sizeUnit?: SizeUnit;

    floorNumber?: number | null;
    totalFloors?: number | null;
    floorLevel?: string;
    propertyUse?: string

    // Amenities
    amenities: string[];

    // Media
    images: string[];
    videoUrl?: string;
    virtualTourUrl?: string;

    // Commercial Specific
    commercialType?: string;
    floorArea?: number | null;
    parkingCapacity?: number | null,
    powerSupplyNotes?: string

    // Agent Info
    agentId: string,
    agentName: string;
    agentPhone: string | null;
    agentEmail: string;
    agentCompany?: string;
    agentPhoto?: string,
    showContact: boolean

    // Meta / Listing Management
    availability: Availability;
    referenceId: string;
    seoSlug: string,
    packageType: PackageType;    
    priorityRank: number | null
    createdAt: Date | undefined;   // ISO undefined
    updatedAt: Date | undefined;  // ISO undefined

    // others
    draftId?: string
    views?: string[]
    isFake?: boolean,
    accountType: "Admin" | "Agent"| ""
}
