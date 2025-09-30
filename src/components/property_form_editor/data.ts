import { Amenity, PropertyTypes } from "../../types/property.types";

export const AMENITIES: Amenity[] = [
    "Parking",
    "Borehole",
    "Generator",
    "CCTV",
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
];

export const PROPERTY_TYPES = [
    "-",
    "Flat",
    "House",
    "Duplex",
    "Bungalow",
    "Terraced",
    "Semi-detached",
    "Detached",
    "Shop",
    "Office",
    "Warehouse",
    "Land",
    "Hotel",
    "Short Let",
];

export const PROPERTY_CATEGORIES = ["-", "Residential", "Commercial", "Land", "Short Let"];
export const STATUS = ["-", "For Rent", "For Sale", "Short Let", "Sold", "Rented"];
export const FURNISHING = ["-", "Furnished", "Semi-furnished", "Unfurnished"];
export const CONDITION = ["-", "New", "Renovated", "Fairly Used", "Needs Renovation"];
export const PRICE_FREQUENCY = [
    "-",
    "Per Year",
    "Total Sale Price",
    "Per Month",
    "Per Day",
];
export const STATES = ["-", "Ogun", "Lagos", "Oyo", "Rivers", "Delta"]; // add as needed
export const CITIES_LOCAL = ["-", "Agbara", "Badagry", "Igbesa", "Lusada", "Sangotedo"];
export const AVAILABILITY = ["Draft", "Pending", "Review", "Published", "unPublished", "Reject"];
export const SIZE_UNIT = ["sqm", "sqft", "plots", "acres"];
export const DEFAULT_PROPERTY_FORM: PropertyTypes = {
    // Basic Info    
    title: "",
    description: "",
    category: "-",
    type: "-",
    status: "-",
    // Pricing
    price: 0,
    priceFrequency: "-",
    negotiable: false,
    serviceCharge: 0,
    agencyFee: 0,
    legalFee: 0,
    currency: "NGN",
    // Property Details
    size: 0,
    sizeUnit: "sqm",
    bedrooms: 0,
    bathrooms: 0,
    toilets: 0,
    parkingSpaces: 0,
    furnishing: "-",
    condition: "-",
    yearBuilt: 0,
    amenities: [] as Amenity[],
    // Media
    images: [],
    videoUrl: "",
    virtualTourUrl: "",
    // Commercial Specific
    floorLevel: "",
    totalFloors: 0,
    propertyUse: "",
    parkingCapacity: 0,
    powerSupplyNotes: "",
    floorArea: 0,
    // location
    state: "",
    city: "",
    area: "",
    street: "",
    landmark: "",
    latitude: 0,
    longitude: 0,
    // agent
    agentName: "",
    agentPhone: 0,
    agentEmail: "",
    agentCompany: "",
    showContact: true,
    // meta
    referenceId: "",
    availability: "Draft",
    packageType: "Free",
    seoSlug: "",
    priorityRank: 10,
    // amenities
    createdAt: "",
    updatedAt: "",
}