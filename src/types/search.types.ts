export type SearchTypes = {
    state?: string;
    city?: string,
    minPrice?: number;
    maxPrice?: number;
    status?: string;
    type?: string;
    amenities?: string[]; // e.g. ["Balcony", "Generator"]
    keyword?: string;     // e.g. "duplex with balcony"
}