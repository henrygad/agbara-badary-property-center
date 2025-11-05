"use client";

import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Spinner } from "./ui/spinner";

interface LocationFeature {
    id: string;
    place_name: string;
    center: [number, number]; // [lng, lat]
}

interface LocationSearchProps {
    value?: string;
    onChange?: (place: { name: string; lat: number; lng: number }) => void;
    placeholder?: string;
    id?: string
}

export default function LocationSearch({
    onChange,    
    placeholder = "Search location (e.g. Agbara, Lagos...)",
    id
}: LocationSearchProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<LocationFeature[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (query.trim().length < 2) {
            setResults([]);
            return;
        }

        const controller = new AbortController();
        const delay = setTimeout(async () => {
            try {
                setLoading(true);
                const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
                if (!token) throw new Error("Missing Mapbox token");

                // Nigeria-only search with Lagos bias (covers Ogun area too)
                const proximity = "3.3792,6.5244"; // Lagos [lng, lat]
                const bbox = "2.676932,4.272,14.678014,13.892007"; // Nigeria bounds

                const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                    query
                )}.json?access_token=${token}&autocomplete=true&country=NG&proximity=${proximity}&bbox=${bbox}&types=place,locality,neighborhood,address,region&language=en&limit=8`;

                const res = await fetch(url, { signal: controller.signal });
                if (!res.ok) throw new Error("Failed to fetch location results");

                const data = await res.json();

                const features: LocationFeature[] = (data.features || []).map(
                    (f: {
                        id: string;
                        place_name: string;
                        center: [number, number];
                    }) => ({
                        id: f.id,
                        place_name: f.place_name,
                        center: f.center,
                    })
                );

                // Sort relevance manually (optional)
                const sorted = features.sort((a, b) =>
                    a.place_name.localeCompare(b.place_name)
                );

                setResults(sorted);
                setShowDropdown(true);
            } catch (error) {
                if ((error as Error).name !== "AbortError") {
                    console.error("Location search error:", error);
                }
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => {
            clearTimeout(delay);
            controller.abort();
        };

    }, [query]);
    

    const handleSelect = (place: LocationFeature) => {
        const [lng, lat] = place.center;
        setQuery(place.place_name);
        setShowDropdown(false);
        if (onChange) {
            onChange({ name: place.place_name, lat, lng });
        }
    };

    return (
        <div className="relative w-full max-w-xl mx-auto">
            <Input
                id={id}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="text-sm w-full py-3 px-4 rounded-full"
                onFocus={() => results.length > 0 && setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            />

            {loading && (
                <span className="absolute right-3 top-3 text-gray-400 text-xs">
                    <Spinner />
                </span>
            )}

            {showDropdown && results.length > 0 && (
                <ul className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow-md max-h-64 overflow-auto">
                    {results.map((place: LocationFeature) => (
                        <li
                            key={place.id}
                            onMouseDown={() => handleSelect(place)}                            
                            className="px-4 py-2 text-sm cursor-pointer hover:bg-red-50"
                        >
                            {place.place_name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
