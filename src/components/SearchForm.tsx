"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronDown, RotateCcw } from "lucide-react";
import { CONDITION, FURNISHING, PROPERTY_CATEGORIES, PROPERTY_TYPES } from "./add_property_form/defaultData";
import { Label } from "./ui/label";
import { useRouter } from "next/navigation";
import { SearchTypes } from "@/types/search.types";
import LocationSearch from "./LocationSearch";

const dafaultData: SearchTypes = {
    status: "Sale",
    location: "",
    type: "",
    bedrooms: "",
    toilets: "",
    minPrice: "",
    maxPrice: "",
    furnishing: "",
    condition: "",
    category: "",
}

type Props = {
    open?: boolean,
    setOpen?: (oppen: boolean) => void
}

export default function SearchForm({ setOpen = () => null }: Props) {
    const [search, setSearch] = useState<SearchTypes>(dafaultData);
    const router = useRouter();

    const [showMore, setShowMore] = useState(false);
    const [showTriangle, setShowTriangle] = useState<"Buy" | "Rent">("Buy");


    const handleChange = (field: keyof SearchTypes, value: string) => {
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
            category: "",
        });
        setShowTriangle("Buy");
    };

    // Handle submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!search || !search.status) return;

        // Build URLSearchParams from 'search', skipping empty values and handling arrays
        const paramsObj = new URLSearchParams();

        Object.entries(search).forEach(([key, val]) => {
            if (val === undefined || val === null) return;
            if (Array.isArray(val)) {
                val.forEach((item) => {
                    if (item !== undefined && item !== null && item !== "") {
                        paramsObj.append(key, String(item));
                    }
                });
            } else {
                if (val !== "") {
                    paramsObj.append(key, String(val));
                }
            }
        });

        const params = paramsObj.toString();

        setOpen(false);
        setTimeout(() => {
            router.push(`/search?${params}`);
        }, 300);
    };

    return (
        <div className="w-full space-y-3 min-w-[320px] sm:min-w-[480px] md:min-w-4xl">
            {/* Tabs */}
            <Tabs
                value={search.status}
                onValueChange={(v: string) => handleChange("status", v)}
            >
                <TabsList className="grid grid-cols-2 text-base w-full max-w-ful h-full">
                    <TabsTrigger
                        value="Sale"
                        className="data-[state=active]:bg-red-700 data-[state=active]:text-white cursor-pointer"
                        onClick={() => setShowTriangle("Buy")}
                    >
                        BUY
                    </TabsTrigger>
                    <TabsTrigger
                        value="Rent"
                        className="data-[state=active]:bg-red-700 data-[state=active]:text-white cursor-pointer"
                        onClick={() => setShowTriangle("Rent")}
                    >
                        RENT
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Tri angle */}
            <div className="relative flex justify-around items-center">
                {showTriangle === "Buy" && <div className="h-7 w-7 rotate-45 border-2 bg-gray-50 -mb-11" />}
                <div className="bg-transparent h-7 w-7 rotate-45 -mb-11" />
                {showTriangle === "Rent" && <div className="h-7 w-7 rotate-45 border-2 bg-gray-50 -mb-11" />}
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="grid grid-col-2 sm:grid-cols-4 gap-4 w-full max-w-full"
            >
                {/* Location */}
                <div className="col-span-2 sm:col-span-4">
                    <LocationSearch
                        id="location"
                        value={search.location}
                        onChange={(value) => handleChange("location", value.name)}
                    />
                </div>

                {/* Property Type */}
                <div>
                    <Label id="type" className="text-sm mb-1">Property type</Label>
                    <Select
                        value={search.type}
                        onValueChange={(val) => handleChange("type", val)}
                    >
                        <SelectTrigger id="type" className="text-sm w-full p-5 text-black">
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                PROPERTY_TYPES.map(t =>
                                    <SelectItem key={t} value={t} >{t}</SelectItem>
                                )
                            }
                        </SelectContent>
                    </Select>
                </div>

                {/* Bedroom */}
                <div>
                    <Label id="bedroom" className="text-sm mb-1">Bedrooms</Label>
                    <Select
                        value={search.bedrooms}
                        onValueChange={(val) => handleChange("bedrooms", val)}
                    >
                        <SelectTrigger id="bedroom" className="text-sm w-full p-5 text-black">
                            <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                            {[1, 2, 3, 4, 5].map((n) => (
                                <SelectItem key={n} value={`${n}`}>
                                    {n} Bedroom{n > 1 ? "s" : ""}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Min price */}
                <div>
                    <Label id="min-price" className="text-sm mb-1">Min Price</Label>
                    <Select
                        value={search.minPrice}
                        onValueChange={(val) => handleChange("minPrice", val)}
                    >
                        <SelectTrigger id="min-price" className="text-sm w-full p-5 text-black">
                            <SelectValue placeholder="No Min" />
                        </SelectTrigger>
                        <SelectContent>
                            {[50000, 100000, 200000, 500000, 1000000].map((p) => (
                                <SelectItem key={p} value={`${p}`}>
                                    ₦{p.toLocaleString()}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Max price */}
                <div>
                    <Label id="max-price" className="text-sm mb-1">Max Price</Label>
                    <Select
                        value={search.maxPrice}
                        onValueChange={(val) => handleChange("maxPrice", val)}
                    >
                        <SelectTrigger id="max-price" className="text-sm w-full p-5 text-black">
                            <SelectValue placeholder="Max Price" />
                        </SelectTrigger>
                        <SelectContent>
                            {[100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000, 15000000].map((p) => (
                                <SelectItem key={p} value={`${p}`}>
                                    ₦{p.toLocaleString()}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* More filters dropdown */}
                <AnimatePresence>
                    {showMore && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden col-span-2 sm:col-span-4"
                        >
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {/* Toilet */}
                                <Select
                                    value={search.toilets}
                                    onValueChange={(val) => handleChange("toilets", val)}
                                >
                                    <SelectTrigger id="toilet" className="text-sm w-full p-5 text-black">
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
                                {/* Furnishing */}
                                <Select
                                    value={search.furnishing}
                                    onValueChange={(val) => handleChange("furnishing", val)}
                                >
                                    <SelectTrigger className="text-sm w-full p-5 text-black">
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

                                {/* Conditon */}
                                <Select
                                    value={search.condition}
                                    onValueChange={(val) => handleChange("condition", val)}
                                >
                                    <SelectTrigger className="text-sm w-full p-5 text-black">
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

                                {/* Category */}
                                <Select
                                    value={search.category}
                                    onValueChange={(val) => handleChange("category", val)}
                                >
                                    <SelectTrigger className="text-sm w-full p-5 text-black">
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
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* More Filters Toggle */}
                <div className="flex items-center justify-center">
                    <button
                        type="button"
                        className="flex text-sm items-center justify-center gap-2"
                        onClick={() => setShowMore(!showMore)}
                    >
                        {!showMore ? " More Options" : "See Less"}{" "}
                        <ChevronDown
                            size={16}
                            className={`transition-transform ${showMore ? "rotate-180" : ""}`}
                        />
                    </button>
                </div>

                {/* Search Button */}
                <Button
                    type="submit"
                    className="sm:col-span-3 text-sm bg-primary hover:bg-red-600 text-white"
                >
                    Search
                </Button>

                {/* Reset Button */}
                <div className="flex justify-center col-span-2 sm:col-span-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleReset}
                        className="text-sm flex items-center justify-center gap-2 hover:text-red-700"
                    >
                        <RotateCcw size={16} /> Reset
                    </Button>
                </div>
            </form>
        </div>
    );
};
