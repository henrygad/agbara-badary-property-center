"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronDown, RotateCcw } from "lucide-react";
import { CONDITION, FURNISHING, PROPERTY_CATEGORIES, PROPERTY_TYPES } from "./add_property/defaultData";
import { PropertyTypes } from "@/types/property.types";

type SearchForm = {
    status: PropertyTypes["status"];
    location: string;
    type: string;
    bedrooms: string;
    toilets: string;
    minPrice: string;
    maxPrice: string;
    furnishing: string;
    condition: string;
    propertyUse: string;
};  

export default function PropertySearchForm() {

    const [search, setSearch] = useState<SearchForm>({
        status: "Sale",
        location: "",
        type: "",
        bedrooms: "",
        toilets: "",
        minPrice: "",
        maxPrice: "",
        furnishing: "",
        condition: "",
        propertyUse: "",
    });

    const [showMore, setShowMore] = useState(false);
    const locationRef = useRef<HTMLInputElement | null>(null);

    // const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    // Initialize Google Places Autocomplete
    // useEffect(() => {
    //     if (!window.google || !locationRef.current) return;
    //     const autocomplete = new window.google.maps.places.Autocomplete(locationRef.current, {
    //         types: ["(cities)"],
    //         componentRestrictions: { country: "ng" }, // Nigeria only
    //     });
    //     autocomplete.addListener("place_changed", () => {
    //         const place = autocomplete.getPlace();
    //         setSearch((prev) => ({
    //             ...prev,
    //             location: place.formatted_address || place.name || "",
    //         }));
    //     });
    //     autocompleteRef.current = autocomplete;
    // }, []);

    // Handle field change
   
   
    const handleChange = (field: keyof SearchForm, value: string) => {
        setSearch((prev) => ({ ...prev, [field]: value }));
    };

    //  Reset filters
    const handleReset = () => {
        setSearch({
            status: "Sale",
            location: "",
            type: "",
            bedrooms: "",
            toilets: "",
            minPrice: "",
            maxPrice: "",
            furnishing: "",
            condition: "",
            propertyUse: "",
        });
    };

    // Handle submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Search submitted:", search);
    };


    return (
        <div className="w-full">
            {/* Tabs */}
            <Tabs
                value={search.status}
                onValueChange={(v: string) => handleChange("status", v)}
                className="w-full mb-4"
            >
                <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="Sale" className="data-[state=active]:bg-red-700 data-[state=active]:text-white">
                        Buy
                    </TabsTrigger>
                    <TabsTrigger value="Rent" className="data-[state=active]:bg-red-700 data-[state=active]:text-white">
                        Rent
                    </TabsTrigger>
                    <TabsTrigger value="Short Let" className="data-[state=active]:bg-red-700 data-[state=active]:text-white">
                        Short Let
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4"
            >
                {/* Location */}
                <Input
                    ref={locationRef}
                    value={search.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    placeholder="Enter state, city, or area"
                    className="text-sm col-span-3"
                />

                {/* Property Type */}
                <Select
                    value={search.type}
                    onValueChange={(val) => handleChange("type", val)}
                >
                    <SelectTrigger className="text-sm w-full">
                        <SelectValue placeholder="Property Type" />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            PROPERTY_TYPES.map(t =>
                                <SelectItem key={t} value={t} >{t}</SelectItem>
                            )
                        }
                    </SelectContent>
                </Select>

                {/* Bedroom */}
                <Select
                    value={search.bedrooms}
                    onValueChange={(val) => handleChange("bedrooms", val)}
                >
                    <SelectTrigger className="text-sm w-full">
                        <SelectValue placeholder="Bedrooms" />
                    </SelectTrigger>
                    <SelectContent>
                        {[1, 2, 3, 4, 5].map((n) => (
                            <SelectItem key={n} value={`${n}`}>
                                {n} Bedroom{n > 1 ? "s" : ""}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Toilet */}
                <Select
                    value={search.toilets}
                    onValueChange={(val) => handleChange("toilets", val)}
                >
                    <SelectTrigger className="text-sm w-full">
                        <SelectValue placeholder="Toilets" />
                    </SelectTrigger>
                    <SelectContent>
                        {[1, 2, 3, 4, 5].map((n) => (
                            <SelectItem key={n} value={`${n}`}>
                                {n} Toilet{n > 1 ? "s" : ""}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Min price */}
                <Select
                    value={search.minPrice}
                    onValueChange={(val) => handleChange("minPrice", val)}
                >
                    <SelectTrigger className="text-sm w-full">
                        <SelectValue placeholder="Min Price" />
                    </SelectTrigger>
                    <SelectContent>
                        {[50000, 100000, 200000, 500000, 1000000].map((p) => (
                            <SelectItem key={p} value={`${p}`}>
                                ₦{p.toLocaleString()}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Max price */}
                <Select
                    value={search.maxPrice}
                    onValueChange={(val) => handleChange("maxPrice", val)}
                >
                    <SelectTrigger className="text-sm w-full">
                        <SelectValue placeholder="Max Price" />
                    </SelectTrigger>
                    <SelectContent>
                        {[100000, 200000, 500000, 1000000, 2000000].map((p) => (
                            <SelectItem key={p} value={`${p}`}>
                                ₦{p.toLocaleString()}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* More Filters Toggle */}
                <Button
                    type="button"
                    variant="ghost"
                    className="flex text-sm items-center justify-center gap-2"
                    onClick={() => setShowMore(!showMore)}
                >
                    {!showMore ? " More Options" : "See Less"}{" "}
                    <ChevronDown
                        size={16}
                        className={`transition-transform ${showMore ? "rotate-180" : ""}`}
                    />
                </Button>

                {/* More filters dropdown */}
                <AnimatePresence>
                    {showMore && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden flex flex-col sm:grid sm:grid-cols-3 sm:col-span-3 gap-4"
                        >
                            <Select
                                value={search.furnishing}
                                onValueChange={(val) => handleChange("furnishing", val)}
                            >
                                <SelectTrigger className="text-sm w-full">
                                    <SelectValue placeholder="Furnishing" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        FURNISHING.map(f =>
                                            <SelectItem key={f} value={f}>{f}</SelectItem>
                                        )
                                    }
                                </SelectContent>
                            </Select>

                            <Select
                                value={search.condition}
                                onValueChange={(val) => handleChange("condition", val)}
                            >
                                <SelectTrigger className="text-sm w-full">
                                    <SelectValue placeholder="Condition" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        CONDITION.map((cd) =>
                                            <SelectItem key={cd} value={cd}>{cd}</SelectItem>
                                        )
                                    }
                                </SelectContent>
                            </Select>

                            <Select
                                value={search.propertyUse}
                                onValueChange={(val) => handleChange("propertyUse", val)}
                            >
                                <SelectTrigger className="text-sm w-full">
                                    <SelectValue placeholder="Property Use" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        PROPERTY_CATEGORIES.map(c =>
                                            <SelectItem key={c} value={c}>{c}</SelectItem>

                                        )
                                    }
                                </SelectContent>
                            </Select>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Search Button */}
                <Button
                    type="submit"
                    className="text-sm bg-red-700 hover:bg-red-800 text-white col-span-3"
                >
                    Search
                </Button>

                {/* Reset Button */}
                <div className="col-span-3 flex justify-center">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleReset}
                        className="text-sm flex items-center justify-center gap-2 text-gray-600 hover:text-red-700"
                    >
                        <RotateCcw size={16} /> Reset
                    </Button>
                </div>

            </form>
        </div>
    );
}
