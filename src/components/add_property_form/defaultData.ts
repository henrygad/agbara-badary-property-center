import { Amenity, PropertyTypes } from "../../types/property.types";

export const AMENITIES: Amenity[] = [
    "Parking Space",
    "Borehole",
    "Generator",
    "CCTV",
    "Electricity",
    "Gated Estate",
    "Swimming Pool",
    "Garden",
    "Balcony",
    "Fitted Kitchen",
    "Air Conditioning",
    "Wardrobes",
    "Water Heater",
    "Playground",
    "Electric Fence",
    "Street Light",
    "Security Guard",
    "Prepaid Meter",
    "Good Road Access",
    "Borehole Water",
    "Fenced",
    "Secure Area",
    "Internet Access",
];

export const PROPERTY_TYPES = [  
    "Flat",
    "House",
    "Duplex",
    "Bungalow",
    "Terraced",
    "Semidetached",
    "Detached",
    "Shop",
    "Office",
    "Warehouse",
    "Plot",
    "Hotel",
    "Short Let",
    "Others"
];

export const PROPERTY_CATEGORIES = ["Residential", "Commercial", "Land", "Short Let"];
export const STATUS = ["Rent", "Sale", "Lease", "Rented", "Sold", "Leased", "Short Let"];
export const FURNISHING = ["Furnished", "Semifurnished", "Unfurnished"];
export const CONDITION = ["New", "Renovated", "Fairly Used", "Needs Renovation"];
export const PRICE_FREQUENCY = [   
    "Yearly",
    "Total",
    "Monthly",
    " Daily",
];

export const REGIONAL_TOWNS = [
    {
        state: "Lagos",
        cities: [
            "Agbara",
            "Ijanikin",                      
            "Iba",
            "Ilogbo-Eremi",
            "Araromi",
            "Ajido",
            "Topo",
            "Mowo",
            "Badagry",
            "Seme Border",
        ]
    },
    {
        state: "Ogun",
        cities: [
            "Agbara",
            "Igbesa",
            "Opic Estate",
            "Ejila Awori",
            "Iyesi",
            "Ilogbo",
            "Atan-Ota",
            "Lusada",
            "Ado-Odo",
            "Idiroko",
        ]
    },
];
export const AVAILABILITY = [    
    {
        name: "Pending",
        value: "Pending"
    },
    {
        name: "Reviewing",
        value: "Reviewing"
    },
    {
        name: "Accept",
        value: "Accepted"
    },
    {
        name: "Remove",
        value: "Removed"
    },
    {
        name: "Reject",
        value: "Rejected"
    },
];
export const SIZE_UNIT = ["sqm", "sqft", "plots", "acres"];
export const PACKAGE_TYPE = ["Free", "Featured", "Premium"];

export const DEFAULT_PROPERTY_FORM: PropertyTypes = {
    // Basic Info    
    title: "",
    description: "",
    category: "",
    type: "",
    status: "",
    // Pricing
    price: null,
    priceFrequency: "Monthly",
    negotiable: false,
    serviceCharge: null,
    serviceChargeFrequency: "Monthly",
    agencyFee: null,
    legalFee: null,
    currency: "NGN",
    // Property Details
    size: null,
    sizeUnit: "sqm",
    bedrooms: null,
    bathrooms: null,
    toilets: null,
    parkingSpaces: null,
    furnishing: "",
    condition: "",
    yearBuilt: null,
    amenities: [] as Amenity[],
    // Media
    images: [],
    videoUrl: "",
    virtualTourUrl: "",
    // Commercial Specific
    floorLevel: "",
    totalFloors: null,
    propertyUse: "",
    parkingCapacity: null,
    floorArea: null,
    powerSupplyNotes: "",
    // location
    state: "",
    city: "",
    area: "",
    street: "",
    landmark: "",
    latitude: null,
    longitude: null,
    // agent
    agentId: "",
    agentName: "",
    agentPhone: "",
    agentEmail: "",
    agentCompany: "",
    showContact: true,
    // meta
    referenceId: "",
    availability: "Pending",
    packageType: "Free",
    seoSlug: "",
    priorityRank: null,
    //others    
    accountType: "",

    // amenities
    createdAt: new Date(),
    updatedAt: undefined,
}