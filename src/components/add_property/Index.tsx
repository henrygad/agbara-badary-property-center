"use client";
import { useEffect, useState } from "react";
import {
    Amenity,
    Condition,
    Furnishing,
    Status,
    PackageType,
    PriceFrequency,
    PropertyCategory,
    PropertyTypes,
    PropertyType,
    SizeUnit,
    Availability,
} from "../../types/property.types";
import FormSection from "@/components/ui/FromSection";
import {
    AMENITIES,
    REGIONAL_TOWNS,
    CONDITION,
    FURNISHING,
    STATUS,
    PRICE_FREQUENCY,
    PROPERTY_CATEGORIES,
    PROPERTY_TYPES,
    SIZE_UNIT,
    AVAILABILITY,
    DEFAULT_PROPERTY_FORM,
    PACKAGE_TYPE,
} from "./defaultData";
import Image from "next/image";
import DisplayImage from "../gallery/DisplayImage";
import React from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { addPropertyDb } from "@/lib/firebase/property_service";
import validatePropertyFields from "@/validators/property_from_editor.validate";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { CustomCalendar } from "../ui/CustomCalader";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import ImageGallery from "../gallery/Index";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { showError, showSuccess } from "../Toasts";
import { formatCurrency, safeValue, fiterSEOSlug, formatDate } from "@/utils";
import { usePropertyStore } from "@/store/usePropertyStore";
import { useImageStore } from "@/store/useImageStore";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import CustomButton from "../CustomButton";

type Props = {
    accountType: "ADMIN" | "AGENT",
    imageGallery?: string[]
}

export default function PropertyFormEditor({ accountType }: Props) {
    const { addProperty } = usePropertyStore();
    const { images, addImage } = useImageStore();


    const [isMounted, setIsMounted] = useState(false);
    const [step, setStep] = useState(1);

    const [form, setForm] = useState<PropertyTypes>(DEFAULT_PROPERTY_FORM);
    const [error, setError] = useState<{ errorMsg: string; isError: boolean }>({ errorMsg: "", isError: false });
    const [loading, setLoading] = useState(false);
    const [isEdited, setIsEdited] = useState(false);

    const [chooseCities, setChooseCities] = useState<string[]>(REGIONAL_TOWNS[0].cities);

    // Form is not empty
    const isFormDirty = Object.values(form).some((val) => val !== "");

    // Hook to detect when form is not empty and save data as draft to local storage
    //const { showPrompt, setShowPrompt, handleSaveAndLeave, handleLeaveWithoutSaving, } = useUnsavedChanges({ shouldBlock: isFormDirty, onSaveDraft: saveDraft });
    useUnsavedChanges({ shouldBlock: isFormDirty, onSaveDraft: saveDraft });


    function update<K extends keyof typeof form>(
        key: K,
        value: (typeof form)[K]
    ) {

        // When data passed to form is edited
        if (!isEdited) {
            setIsEdited(true);
        };

        setForm((s) => ({ ...s, [key]: value }));
    }

    function toggleAmenity(amenity: Amenity) {
        setForm((s) => {
            const has = s.amenities.includes(amenity);
            return {
                ...s,
                amenities: has
                    ? s.amenities.filter((a) => a !== amenity)
                    : [...s.amenities, amenity],
            } as typeof form;
        });
    }

    function changeSteps(p: "Back" | "Next" | number) {
        if (p === "Back") {
            setStep((s) => s - 1)
        } else if (p === "Next") {
            setStep((s) => s + 1)
        } else {
            setStep(p);
        }
        window.scrollTo(0, 0)
    };

    // Save draft to local storage
    function saveDraft() {
        const getPropertyDraft = JSON.parse(localStorage.getItem("property-draft") || "[]");
        localStorage.setItem("property-draft", JSON.stringify(
            [
                ...getPropertyDraft,
                { ...form, draftId: String(Date.now() + Math.random()) }
            ]));
        setForm(DEFAULT_PROPERTY_FORM);
        showSuccess("Draft saved!", "Draft have been saved locally")
    };

    // form submission handler (create new property listing to firestore)
    async function submitForm(e?: React.FormEvent) {
        e?.preventDefault();
        setLoading(true);

        try {
            // validate essential fields
            const error = validatePropertyFields(form);
            if (error.isError) {
                throw new Error(error.errorMsg);
            }

            // Prepare payload for your API or Firestore
            const payload: PropertyTypes = {
                ...form,
                seoSlug: form.seoSlug + "-" + Date.now(),
                referenceId: `AGB-${Date.now()}`,
            };

            const draftId = payload.draftId;

            // Simulate API call
            const property = await addPropertyDb(payload);

            // Simulate successful response
            if (!property) return;

            if (draftId) {
                // Delete draf from store
            }

            addProperty(property);

            showSuccess("Property submitted!",
                `Your listing has been ${form.referenceId.trim() ? "updated" : accountType === "ADMIN" ? "created" : "submited"}.`
            )

            setForm(DEFAULT_PROPERTY_FORM);
            setError({ errorMsg: "", isError: false });
            changeSteps(1);

        } catch (err) {
            const errorMsg = err as { message: string };
            showError("Failed to submit", errorMsg.message);
            setError({
                errorMsg: errorMsg.message,
                isError: true,
            });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {

        let clearOut: NodeJS.Timeout | undefined = undefined;

        // Get data to edit from localStorage
        // Check if toEdit data is present
        const update = localStorage.getItem("updateProperty");

        if (update) {
            const parsed = JSON.parse(update) as PropertyTypes;
            clearOut = setTimeout(() => {
                setForm(parsed);
                localStorage.removeItem("updateProperty");
            }, 200);
        }


        // Get duplicated data from localStorage
        // Check if duplicate data is present
        const duplicate = localStorage.getItem("duplicateProperty");

        if (duplicate) {
            const parsed = JSON.parse(duplicate) as PropertyTypes;
            // clear the  UID so it will generate a new one
            parsed.id = "";
            parsed.referenceId = "";

            clearOut = setTimeout(() => {
                setForm(parsed);
                localStorage.removeItem("duplicateProperty");
            }, 200);

        }

        setIsMounted(true)

        return () => clearTimeout(clearOut);
    }, []);


    if (!isMounted) return <div>Loading...</div>

    return (
        <div className="w-full bg-inherit">
            {/* Steps */}
            <menu className="mb-6">
                <div className="flex gap-2">
                    {
                        Array(5).fill("").map((_, idx) =>
                            <Button
                                key={idx + 1}
                                variant={step === idx + 1 ? "destructive" : "outline"}
                                size="icon"
                                className="rounded-full cursor-pointer"
                                onClick={() => setStep(idx + 1)}
                            >
                                {idx + 1}
                            </Button>
                        )
                    }
                </div>

            </menu>
            {/* Property form editor */}
            <form onSubmit={submitForm} className="space-y-6">
                {/* Basic info */}
                {step === 1 && (
                    <FormSection title="Basic Info">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Title */}
                            <div>
                                <Label htmlFor="title" className="text-sm font-medium mb-1">
                                    Title
                                </Label>
                                <Input
                                    id="title"
                                    className={`w-full text-sm
                                        ${error.errorMsg.toLowerCase().includes("title") ? "border-red-600" : ""}
                                        `}
                                    placeholder="3-Bedroom Flat for Rent in Agbara Estate"
                                    value={form.title ?? ""}
                                    onChange={(e) => {
                                        update("title", e.target.value);
                                        update("seoSlug", fiterSEOSlug(e.target.value));
                                    }}
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <Label className="block text-sm font-medium mb-1">
                                    Category
                                </Label>
                                <Select
                                    value={form.category}
                                    defaultValue={form.category}
                                    onValueChange={(value) =>
                                        update("category", value as PropertyCategory)
                                    }
                                >
                                    <SelectTrigger
                                        className={`w-full cursor-pointer
                                        ${error.errorMsg.toLowerCase().includes("category") ? "border-red-600" : ""}
                                        `}
                                    >
                                        <SelectValue
                                            placeholder="Select a category"
                                            className="text-sm"
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PROPERTY_CATEGORIES.map((cat) => (
                                            <SelectItem
                                                className="cursor-pointer text-sm"
                                                key={cat}
                                                value={cat}
                                            >
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Type */}
                            <div>
                                <Label className="block text-sm font-medium mb-1">Type</Label>
                                <Select
                                    value={form.type}
                                    onValueChange={(value) =>
                                        update("type", value as PropertyType)
                                    }
                                >
                                    <SelectTrigger
                                        className={`w-full cursor-pointer
                                        ${error.errorMsg.toLowerCase().includes("type") ? "border-red-600" : ""}
                                        `}
                                    >
                                        <SelectValue
                                            placeholder="Select a type"
                                            className="text-sm"
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PROPERTY_TYPES.map((type) => (
                                            <SelectItem
                                                className="cursor-pointer text-sm"
                                                key={type}
                                                value={type}
                                            >
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Status */}
                            <div>
                                <Label className="block text-sm font-medium mb-1">Status</Label>
                                <Select
                                    value={form.status}
                                    onValueChange={(value) => update("status", value as Status)}
                                >
                                    <SelectTrigger
                                        className={`w-full cursor-pointer
                                        ${error.errorMsg.toLowerCase().includes("status") ? "border-red-600" : ""}
                                        `}
                                    >
                                        <SelectValue
                                            placeholder="Select a status"
                                            className="text-sm"
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {STATUS.map((status) => (
                                            <SelectItem
                                                className="cursor-pointer text-sm"
                                                key={status}
                                                value={status}
                                            >
                                                {status}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <Label className="block text-sm font-medium mb-1">
                                    Description
                                </Label>
                                <Textarea
                                    placeholder="Provide full description, nearby landmarks, special conditions, etc."
                                    value={form.description}
                                    onChange={(e) => update("description", e.target.value)}
                                    className="w-full text-sm min-h-40 resize-none"
                                />
                            </div>
                        </div>
                    </FormSection>
                )}

                {/* Location & Pricing */}
                {step === 2 && (
                    <FormSection title="Location & Pricing">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* State */}
                            <div>
                                <Label className="block text-sm font-medium mb-1">State</Label>
                                <Select
                                    value={form.state}
                                    onValueChange={(value) => update("state", value)}
                                >
                                    <SelectTrigger
                                        className={`w-full cursor-pointer
                                        ${error.errorMsg.toLowerCase().includes("state") ? "border-red-600" : ""}
                                        `}
                                    >
                                        <SelectValue
                                            placeholder="Select a state"
                                            className="text-sm capitalize"
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {REGIONAL_TOWNS.map((state) => (
                                            <SelectItem
                                                className="cursor-pointer text-sm capitalize"
                                                key={state.state}
                                                value={state.state}
                                                onClick={() => setChooseCities(state.cities)}
                                            >
                                                {state.state}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* City */}
                            <div>
                                <Label className="block text-sm font-medium mb-1">City</Label>
                                <Select
                                    value={form.city}
                                    onValueChange={(value) => update("city", value)}
                                >
                                    <SelectTrigger
                                        className={`w-full cursor-pointer
                                        ${error.errorMsg.toLowerCase().includes("city") ? "border-red-600" : ""}
                                        `}
                                    >
                                        <SelectValue
                                            placeholder="Select a city"
                                            className="text-sm capitalize"
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {chooseCities.map((city) => (
                                            <SelectItem
                                                className="cursor-pointer text-sm capitalize"
                                                key={city}
                                                value={city}
                                            >
                                                {city}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Area */}
                            <div>
                                <Label htmlFor="Area" className="text-sm font-medium mb-1">
                                    Area
                                </Label>
                                <Input
                                    id="Area"
                                    className={`w-full text-sm 
                                        ${error.errorMsg.toLowerCase().includes("area") ? "border-red-600" : ""}
                                        `}
                                    placeholder="Agbara Estate"
                                    value={form.area ?? ""}
                                    onChange={(e) => update("area", e.target.value)}
                                />
                            </div>

                            {/* Street */}
                            <div>
                                <Label
                                    htmlFor="Street"
                                    className="text-sm font-medium mb-1"
                                >
                                    Street Address
                                </Label>
                                <Input
                                    id="Street"
                                    value={form.street ?? ""}
                                    onChange={(e) => update("street", e.target.value)}
                                    className="w-full text-sm"
                                    placeholder="House 12, Block A"
                                />
                            </div>

                            {/* Landmark */}
                            <div>
                                <Label
                                    htmlFor="Landmark"
                                    className="text-sm font-medium mb-1"
                                >
                                    Landmark
                                </Label>
                                <Input
                                    id="Landmark"
                                    value={form.landmark ?? ""}
                                    onChange={(e) => update("landmark", e.target.value)}
                                    className="w-full text-sm"
                                    placeholder="Near Vesper School"
                                />
                            </div>

                            {/* Map Coordinates */}
                            <div>
                                <Label className="text-sm font-medium mb-1">
                                    Map Coordinates (lat , long)
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={form.latitude === null ? "" : form.latitude ?? ""}
                                        onChange={(e) =>
                                            update("latitude", Number(e.target.value))
                                        }
                                        className="w-1/2 text-sm"
                                        placeholder="6.45"
                                        type="number"
                                    />
                                    <Input
                                        value={
                                            form.longitude === null ? "" : form.longitude ?? ""
                                        }
                                        onChange={(e) =>
                                            update("longitude", Number(e.target.value))
                                        }
                                        className="w-1/2 text-sm"
                                        placeholder="3.2"
                                        type="number"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-3 space-y-4">
                                {/* Price & Frequency */}
                                <div>
                                    <Label className="text-sm font-medium mb-1">Price</Label>
                                    <div className="flex flex-col-reverse sm:flex-row gap-2">
                                        <Input
                                            type="number"
                                            placeholder="600,000"
                                            className={` text-sm
                                                     ${error.errorMsg.toLowerCase().includes("price") ? "border-red-600" : ""}
                                                `}
                                            value={form.price === null ? "" : form.price ?? ""}
                                            onChange={(e) =>
                                                update("price", Number(e.target.value))
                                            }
                                        />
                                        <Select
                                            value={form.priceFrequency}
                                            onValueChange={(value) =>
                                                update("priceFrequency", value as PriceFrequency)
                                            }
                                        >
                                            <SelectTrigger
                                                className={`w-full sm:w-auto cursor-pointer
                                                         ${error.errorMsg.toLowerCase().includes("price frequency") ? "border-red-600" : ""}
                                                    `}
                                            >
                                                <SelectValue
                                                    placeholder="Choose Frequency"
                                                    className="text-sm"
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {PRICE_FREQUENCY.map((p) => (
                                                    <SelectItem
                                                        className="cursor-pointer text-sm"
                                                        key={p}
                                                        value={p}
                                                    >
                                                        {p}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Negotiable */}
                                <div className="flex items-center gap-2 my-5">
                                    <Checkbox
                                        checked={form.negotiable}
                                        onCheckedChange={() =>
                                            update("negotiable", !form.negotiable)
                                        }
                                        className="cursor-pointer h-6 w-6"
                                    />
                                    <Label htmlFor="negotiable" className="block">
                                        <span className="block text-sm font-medium text-slate-950">
                                            Negotiable
                                        </span>
                                        <span className="block text-xs text-slate-500">
                                            Allow buyers or renters to negotiate the price of this
                                            property.
                                        </span>
                                    </Label>
                                </div>

                                {/* Service Charge & agent fee $ legal fee */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="flex flex-col">
                                        <Label className="text-sm font-medium mb-1">
                                            Service Charge
                                        </Label>
                                        <Input
                                            value={
                                                form.serviceCharge === null
                                                    ? ""
                                                    : form.serviceCharge ?? ""
                                            }
                                            onChange={(e) =>
                                                update("serviceCharge", Number(e.target.value))
                                            }
                                            className=" text-sm"
                                            placeholder="20,000"
                                            type="number"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <Label className="text-sm font-medium mb-1">
                                            Agency Fee
                                        </Label>
                                        <Input
                                            value={
                                                form.agencyFee === null ? "" : form.agencyFee ?? ""
                                            }
                                            onChange={(e) =>
                                                update("agencyFee", Number(e.target.value))
                                            }
                                            className=" text-sm"
                                            placeholder="100,000"
                                            type="number"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <Label className="text-sm font-medium mb-1">
                                            Legal Fee
                                        </Label>
                                        <Input
                                            value={
                                                form.legalFee === null ? "" : form.legalFee ?? ""
                                            }
                                            onChange={(e) =>
                                                update("legalFee", Number(e.target.value))
                                            }
                                            className=" text-sm"
                                            placeholder="10,0000"
                                            type="number"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FormSection>
                )}

                {/* Property Details & Amenities */}
                {step === 3 && (
                    <FormSection title=" Property Details & Amenities">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Bedrooms */}
                            <div>
                                <Label className="text-sm font-medium mb-1">Bedrooms</Label>
                                <Input
                                    type="number"
                                    value={form.bedrooms === null ? "" : form.bedrooms ?? ""}
                                    onChange={(e) => update("bedrooms", Number(e.target.value))}
                                    className="w-full text-sm"
                                    placeholder="3"
                                    min={0}
                                />
                            </div>

                            {/* Bathrooms */}
                            <div>
                                <Label className="text-sm font-medium mb-1">
                                    Bathrooms
                                </Label>
                                <Input
                                    type="number"
                                    value={form.bathrooms === null ? "" : form.bathrooms ?? ""}
                                    onChange={(e) =>
                                        update("bathrooms", Number(e.target.value))
                                    }
                                    className="w-full text-sm"
                                    placeholder="3"
                                    min={0}
                                />
                            </div>

                            {/* Toilets */}
                            <div>
                                <Label className="text-sm font-medium mb-1">Toilets</Label>
                                <Input
                                    type="number"
                                    value={form.toilets === null ? "" : form.toilets ?? ""}
                                    onChange={(e) => update("toilets", Number(e.target.value))}
                                    className="w-full text-sm"
                                    placeholder="4"
                                    min={0}
                                />
                            </div>

                            {/* Parking Space */}
                            <div>
                                <Label className="text-sm font-medium mb-1">
                                    Parking Spaces
                                </Label>
                                <Input
                                    type="number"
                                    value={
                                        form.parkingSpaces === null
                                            ? ""
                                            : form.parkingSpaces ?? ""
                                    }
                                    onChange={(e) =>
                                        update("parkingSpaces", Number(e.target.value))
                                    }
                                    className="w-full text-sm"
                                    placeholder="2"
                                    min={0}
                                />
                            </div>

                            {/* Parking Capacity */}
                            <div>
                                <Label className="text-sm font-medium mb-1">
                                    Parking Capacity
                                </Label>
                                <Input
                                    type="number"
                                    value={
                                        form.parkingCapacity === null
                                            ? ""
                                            : form.parkingCapacity ?? ""
                                    }
                                    onChange={(e) =>
                                        update("parkingCapacity", Number(e.target.value))
                                    }
                                    className="w-full text-sm"
                                    placeholder="15"
                                    min={0}
                                />
                            </div>

                            {/* Furnishing */}
                            <div>
                                <Label className="text-sm font-medium mb-1">
                                    Furnishing
                                </Label>
                                <Select
                                    value={form.furnishing}
                                    onValueChange={(value) =>
                                        update("furnishing", value as Furnishing)
                                    }
                                >
                                    <SelectTrigger className="w-full cursor-pointer">
                                        <SelectValue
                                            placeholder="Select furnishing"
                                            className="text-sm"
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {FURNISHING.map((f) => (
                                            <SelectItem
                                                key={f}
                                                value={f}
                                                className="cursor-pointer text-sm"
                                            >
                                                {f}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Condition */}
                            <div>
                                <Label className="text-sm font-medium mb-1">
                                    Condition
                                </Label>
                                <Select
                                    value={form.condition}
                                    onValueChange={(value) =>
                                        update("condition", value as Condition)
                                    }
                                >
                                    <SelectTrigger className="w-full cursor-pointer">
                                        <SelectValue
                                            placeholder="Select condition"
                                            className="text-sm"
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CONDITION.map((c) => (
                                            <SelectItem
                                                key={c}
                                                value={c}
                                                className="cursor-pointer text-sm"
                                            >
                                                {c}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Property Size */}
                            <div>
                                <Label className="text-sm font-medium mb-1">
                                    Property Size
                                </Label>
                                <div className="flex flex-col-reverse sm:flex-row gap-2">
                                    <Input
                                        type="number"
                                        value={form.size === null ? "" : form.size ?? ""}
                                        onChange={(e) => update("size", Number(e.target.value))}
                                        className=" text-sm"
                                        placeholder="120"
                                    />
                                    <Select
                                        value={form.sizeUnit}
                                        onValueChange={(value) =>
                                            update("sizeUnit", value as SizeUnit)
                                        }
                                    >
                                        <SelectTrigger className="w-full sm:w-auto cursor-pointer">
                                            <SelectValue placeholder="Unit" className="text-sm" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SIZE_UNIT.map((s) => (
                                                <SelectItem
                                                    className="text-sm cursor-pointer"
                                                    value={s}
                                                    key={s}
                                                >
                                                    {s}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Year built */}
                            <div>
                                <Label className="text-sm font-medium mb-1">
                                    Year Built
                                </Label>
                                <Input
                                    type="number"
                                    value={form.yearBuilt === null ? "" : form.yearBuilt ?? ""}
                                    onChange={(e) =>
                                        update("yearBuilt", Number(e.target.value))
                                    }
                                    className="w-full text-sm"
                                    placeholder="2015"
                                />
                            </div>

                            {/* Floor Level */}
                            <div>
                                <Label className="text-sm font-medium mb-1">
                                    Floor Level
                                </Label>
                                <Input
                                    value={
                                        form.floorLevel === null ? "" : form.floorLevel ?? ""
                                    }
                                    onChange={(e) => update("floorLevel", e.target.value)}
                                    className="w-full text-sm"
                                    placeholder="Ground / 1st / 2nd"
                                />
                            </div>

                            {/* Total Floors */}
                            <div>
                                <Label className="text-sm font-medium mb-1">
                                    Total Floors
                                </Label>
                                <Input
                                    type="number"
                                    value={
                                        form.totalFloors === null ? "" : form.totalFloors ?? ""
                                    }
                                    onChange={(e) =>
                                        update("totalFloors", Number(e.target.value))
                                    }
                                    className="w-full text-sm"
                                    placeholder="3"
                                />
                            </div>

                            {/* Floor Area */}
                            <div>
                                <Label className="text-sm font-medium mb-1">
                                    Floor Area
                                </Label>
                                <Input
                                    type="number"
                                    value={form.floorArea === null ? "" : form.floorArea ?? ""}
                                    onChange={(e) =>
                                        update("floorArea", Number(e.target.value))
                                    }
                                    className="w-full text-sm"
                                    placeholder="2000"
                                />
                            </div>

                            {/* Amenities    */}
                            <div className="md:col-span-3">
                                <Label className="text-sm font-medium mb-1">
                                    Amenities
                                </Label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {AMENITIES.map((amen) => (
                                        <Label
                                            key={amen}
                                            className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950 cursor-pointer"
                                        >
                                            <Checkbox
                                                id={amen}
                                                defaultChecked={form.amenities?.includes(
                                                    amen as Amenity
                                                )}
                                                onCheckedChange={() => toggleAmenity(amen)}
                                                className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked] dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                                            />
                                            <div className="grid gap-1.5 font-mudium">
                                                <p className="text-sm leading-none font-medium">
                                                    {amen}
                                                </p>
                                            </div>
                                        </Label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </FormSection>
                )}

                {/* Media & Agent Info */}
                {step === 4 && (
                    <FormSection title="Media & Agent Details">
                        <div className="w-full space-y-6">
                            {/* Images */}
                            <div>
                                <Label className="text-sm font-medium mb-1">
                                    Display Images
                                </Label>
                                <ScrollArea
                                    className="w-full whitespace-nowrap max-w-[330px] sm:max-w-[480px] md:max-w-full"
                                >
                                    <div className="flex gap-2">
                                        {form.images?.length ?
                                            form.images.map((src, idx) => (
                                                <DisplayImage
                                                    key={idx}
                                                    className="w-[160px] h-[160px] rounded border shadow"
                                                    src={src}
                                                    alt={src}
                                                    handleremove={true}
                                                    remove={(src) => {
                                                        update(
                                                            "images",
                                                            form.images.filter((img) => img !== src)
                                                        );
                                                    }}
                                                />
                                            )) :
                                            null
                                        }
                                        <ImageGallery
                                            galleryImages={images}
                                            setGalleryImages={(imgs) => imgs.map(img => addImage(img))}
                                            setGetSelected={(img) => update("images", [...form.images, ...img.map(img => img.url)])}
                                        />
                                    </div>
                                    <ScrollBar orientation="horizontal" />
                                </ScrollArea>
                            </div>

                            {/* Video / Virtual Tour Link */}
                            <div>
                                <Label className="text-sm font-medium mb-1">
                                    Video / Virtual Tour Link (optional)
                                </Label>
                                <Input
                                    value={form.videoUrl ?? ""}
                                    onChange={(e) => update("videoUrl", e.target.value)}
                                    placeholder="YouTube link or 360 tour URL"
                                    className="w-full text-sm"
                                />
                                <p className="block text-xs text-gray-500 text-center text-wrap mt-1">
                                    Please upload your property video to <span className="text-red-500 font-medium">YouTube</span> and share the link here.
                                </p>

                            </div>

                            {/* Agent / Owner details */}
                            <div>
                                <Label className="text-sm font-medium mb-1 mt-4">
                                    Agent / Owner
                                </Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        value={form.agentName}
                                        onChange={(e) => update("agentName", e.target.value)}
                                        className="w-full text-sm"
                                        placeholder="Agent name"
                                    />
                                    <div className="relative flex justify-start items-center">
                                        <span className="absolute top-0 left-0 bottom-0 flex">
                                            <span className="flex-1 flex justify-center items-center text-sm font-normal px-4">
                                                +234
                                            </span>
                                        </span>
                                        <Input
                                            type="number"
                                            value={
                                                form.agentPhone === null ? "" : form.agentPhone ?? ""
                                            }
                                            onChange={(e) => {
                                                if (isNaN(Number(e.target.value))) return;
                                                update("agentPhone", Number(e.target.value));
                                            }}
                                            className="w-full text-sm pl-15"
                                            placeholder="Phone number"
                                        />
                                    </div>
                                    <Input
                                        type="email"
                                        value={form.agentEmail}
                                        onChange={(e) => update("agentEmail", e.target.value)}
                                        className="w-full text-sm"
                                        placeholder="Email"
                                    />
                                    <Input
                                        value={form.agentCompany}
                                        onChange={(e) => update("agentCompany", e.target.value)}
                                        className="w-full text-sm"
                                        placeholder="Company name"
                                    />
                                    <div className="flex gap-2">
                                        <Checkbox
                                            defaultChecked={form.showContact}
                                            onCheckedChange={() => {
                                                update("showContact", !form.showContact);
                                            }}
                                            className="cursor-pointer"
                                        />
                                        <Label htmlFor="negotiable" className="block">
                                            <span className="block text-sm font-medium text-slate-950">
                                                Show contact publicly
                                            </span>
                                        </Label>
                                    </div>
                                </div>
                            </div>

                            {/* Meta / Listing Management */}
                            <div className="flex-1  mt-4">
                                <Label className="text-base font-medium mt-1">
                                    Meta / Listing Management
                                </Label>

                                <div className="space-y-4 md:grid md:grid-col-2 md:gap-4 mt-4">
                                    {/* SEO Slug */}
                                    <div className="flex-1 flex flex-col col-span-2">
                                        <Label
                                            htmlFor="seoSlug"
                                            className="text-sm font-medium mb-1"
                                        >
                                            SEO Slug
                                        </Label>
                                        <Input
                                            id="seoSlug"
                                            placeholder="3-bedroom-flat-agbara"
                                            value={form.seoSlug}
                                            className=" text-sm"
                                            readOnly
                                        />
                                        <p className="text-xs text-slate-400 block mt-1">
                                            Used for clean property URLs
                                        </p>
                                    </div>

                                    {/* Reference ID */}
                                    <div className="flex flex-col">
                                        <Label
                                            htmlFor="referenceId"
                                            className="text-sm font-medium mb-1"
                                        >
                                            Reference ID
                                        </Label>
                                        <Input
                                            id="referenceId"
                                            placeholder="AGB-20250922-001"
                                            value={form.referenceId}
                                            onChange={(e) => update("referenceId", e.target.value)}
                                            readOnly
                                            className=" text-sm"
                                        />
                                    </div>

                                    {/* Listing Status */}
                                    <div className="flex flex-col">
                                        <Label className="text-sm font-medium mb-1">
                                            Availability
                                        </Label>
                                        <Select
                                            value={form.availability}
                                            onValueChange={(value) =>
                                                update("availability", value as Availability)
                                            }
                                        >
                                            <SelectTrigger className="w-full cursor-pointer">
                                                <SelectValue
                                                    placeholder="Select status"
                                                    className="text-sm"
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {AVAILABILITY.map((s) => (
                                                    <SelectItem
                                                        className="cursor-pointer text-sm"
                                                        value={s}
                                                        key={s}
                                                    >
                                                        {s}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Package Type */}
                                    <div className="flex flex-col">
                                        <Label className="text-sm font-medium mb-1">
                                            Package Type
                                        </Label>
                                        <Select
                                            value={form.packageType}
                                            onValueChange={(value) =>
                                                update("packageType", value as PackageType)
                                            }
                                        >
                                            <SelectTrigger className="w-full cursor-pointer">
                                                <SelectValue
                                                    placeholder="Select package type"
                                                    className="text-sm"
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {PACKAGE_TYPE.map((p) => (
                                                    <SelectItem
                                                        className="cursor-pointer text-sm"
                                                        value={p}
                                                        key={p}
                                                    >
                                                        {p}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Priority Rank */}
                                    <div className="flex flex-col">
                                        <Label
                                            htmlFor="priorityRank"
                                            className="text-sm font-medium mb-1"
                                        >
                                            Priority Rank
                                        </Label>
                                        <Input
                                            id="priorityRank"
                                            type="number"
                                            min={1}
                                            max={10}
                                            placeholder="1-10"
                                            value={
                                                form.priorityRank === null
                                                    ? ""
                                                    : form.priorityRank ?? ""
                                            }
                                            onChange={(e) =>
                                                update("priorityRank", Number(e.target.value))
                                            }
                                            className=" text-sm"
                                        />
                                        <p className="block mt-1 text-xs text-slate-500">
                                            Higher rank means appearing earlier in search results
                                        </p>
                                    </div>

                                    {/* Date Listed */}
                                    <div className="flex justify-center col-span-2 w-full">
                                        <CustomCalendar
                                            date={form.createdAt}
                                            setDate={(date) => update("createdAt", date)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FormSection>
                )}

                {/* Preview & Confirm */}
                {step === 5 && (
                    <FormSection title="Preview Your Listing">
                        <div>
                            {/* Gallery Slider */}
                            <div>
                                {form.images?.length ? (
                                    <Carousel className="w-full">
                                        <CarouselContent>
                                            {form.images.map((url, i) => (
                                                <CarouselItem key={i}>
                                                    <div className="relative w-full h-80 rounded-lg">
                                                        <Image
                                                            key={i}
                                                            src={url}
                                                            alt={`preview-${i}`}
                                                            fill
                                                            className="w-full h-80 object-cover rounded-lg border shadow"
                                                        />
                                                    </div>
                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                        <CarouselPrevious
                                            type="button"
                                            className="h-10 w-10 left-1 cursor-pointer  text-red-700 bg-amber-500"
                                        />
                                        <CarouselNext
                                            type="button"
                                            className="h-10 w-10 right-1 cursor-pointer text-red-700 bg-amber-500"
                                        />
                                    </Carousel>
                                ) : (
                                    <div className="w-full h-72 bg-gray-100 flex items-center justify-center text-gray-500">
                                        No Image Uploaded
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="space-y-6 mt-4">

                                {/* Title & Price */}
                                <div>
                                    <div className="flex justify-between flex-wrap items-center gap-4">
                                        <h1 className="text-2xl font-medium text-gray-800 dark:text-white">
                                            {form.title || "Untitled Property"}
                                        </h1>
                                        <p className="text-xl font-medium text-green-700">
                                            {formatCurrency(form.price)}{" "}
                                            {form.price && form.priceFrequency
                                                ? ` / ${form.priceFrequency}`
                                                : ""}
                                        </p>
                                    </div>
                                    {form.negotiable &&
                                        <div className="flex justify-end">
                                            <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
                                                Negotiable
                                            </span>
                                        </div>
                                    }
                                    <p className="text-sm font-medium text-wrap p-2 text-slate-700 dark:text-white">
                                        {form.description || "Provide description"}
                                    </p>
                                </div>

                                {/* Fees */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700 dark:text-white">
                                    <p>
                                        <strong>Service Charge</strong>:{" "}
                                        {formatCurrency(form.serviceCharge)}
                                    </p>
                                    <p>
                                        <strong>Agency Fee</strong>:{" "}
                                        {formatCurrency(form.agencyFee)}
                                    </p>
                                    <p>
                                        <strong>Legal Fee</strong>:{" "}
                                        {formatCurrency(form.legalFee)}
                                    </p>
                                    <p>
                                        <strong>Status</strong>: {safeValue(form.status)}
                                    </p>
                                </div>

                                {/* Meta Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-1">
                                        <p>
                                            <strong>Availability:</strong>{" "}
                                            {form.title.trim() ? safeValue(form.availability) : "-"}
                                        </p>
                                        <p>
                                            <strong>Priority Rank:</strong>{" "}
                                            {form.title.trim() ? safeValue(form.priorityRank) : "-"}
                                        </p>
                                        <p>
                                            <strong>Ref ID:</strong>{" "}
                                            {form.availability != "Draft" &&
                                                safeValue(form.referenceId)}
                                        </p>
                                        <p>
                                            <strong>Catigory:</strong> {safeValue(form.category)}
                                        </p>
                                        <p>
                                            <strong>Type:</strong> {safeValue(form.type)}
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <p>
                                            <strong>Location:</strong>{" "}
                                            {[form.street, form.area, form.city, form.state]
                                                .filter(Boolean)
                                                .join(", ") || "—"}
                                        </p>
                                        <p>
                                            <strong>Bedrooms:</strong> {safeValue(form.bedrooms)}
                                        </p>
                                        <p>
                                            <strong>Bathrooms:</strong> {safeValue(form.bathrooms)}
                                        </p>
                                        <p>
                                            <strong>Toilets:</strong> {safeValue(form.toilets)}
                                        </p>
                                        <p>
                                            <strong>Parking Spaces:</strong>{" "}
                                            {safeValue(form.parkingSpaces)}
                                        </p>
                                        <p>
                                            <strong>Parking Capacity:</strong>{" "}
                                            {safeValue(form.parkingCapacity)}
                                        </p>
                                    </div>
                                </div>

                                {/* Extra Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <p>
                                        <strong>Furnishing:</strong> {safeValue(form.furnishing)}
                                    </p>
                                    <p>
                                        <strong>Condition:</strong> {safeValue(form.condition)}
                                    </p>
                                    <p>
                                        <strong>Floor Level:</strong> {safeValue(form.floorLevel)}
                                    </p>
                                    <p>
                                        <strong>Total Floors:</strong>{" "}
                                        {safeValue(form.totalFloors)}
                                    </p>
                                    <p>
                                        <strong>Floor Area:</strong> {safeValue(form.floorArea)}
                                    </p>
                                    <p>
                                        <strong>Year Built:</strong> {safeValue(form.yearBuilt)}
                                    </p>
                                    <p>
                                        <strong>Size:</strong> {safeValue(form.size)}{" "}
                                        {safeValue(form.size) !== "—" && safeValue(form.sizeUnit)}
                                    </p>
                                </div>

                                {/* Amenities */}
                                <div>
                                    <h2 className="font-medium text-gray-800 dark:text-white mb-2">
                                        Amenities
                                    </h2>
                                    {form.amenities?.length ? (
                                        <ul className="grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-white">
                                            {form.amenities.map((a, i) => (
                                                <li key={i} className="flex items-center gap-2">
                                                    ✅ {a}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500 text-sm">
                                            No amenities specified
                                        </p>
                                    )}
                                </div>

                                {/* Agent Info */}
                                <div>
                                    <h2 className="font-medium text-gray-800 dark:text-white mb-2">
                                        Agent Information
                                    </h2>
                                    <p className="text-sm font-medium text-slate-700 dark:text-white">
                                        {safeValue(form.agentName)} | {safeValue(form.agentPhone) ? "+234" + " " + safeValue(form.agentPhone) : ""}{" "}
                                        | {safeValue(form.agentEmail)}
                                    </p>
                                    <p className="text-sm font-medium text-slate-700 dark:text-white">
                                        {safeValue(form.agentCompany)}
                                    </p>
                                </div>

                                {/* Dates */}
                                <div className="text-sm text-gray-700  dark:text-slate-400 border-t pt-3">
                                    <p>
                                        Listed on{" "}
                                        {form.createdAt
                                            ? formatDate(form.createdAt)
                                            : "—"
                                        }
                                    </p>
                                </div>

                                {/* Seo Slug */}
                                <div className="mt-2">
                                    <p className="text-xs text-slate-700 dark:text-slate-400">
                                        {safeValue(form.seoSlug)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </FormSection>
                )}

                {/* Navigation buttons */}
                <div className="flex items-center justify-between">
                    {step > 1 && (
                        <Button
                            type="button"
                            variant="ghost"
                            className="flex gap-2 cursor-pointer"
                            onClick={() => changeSteps("Back")}
                        >
                            <ArrowLeftIcon className="h-5 w-5" />  Back
                        </Button>
                    )}
                    {step < 5 && (
                        <div className="flex justify-end items-center w-full">
                            <Button
                                type="button"
                                variant="ghost"
                                className="flex gap-2 cursor-pointer"
                                onClick={() => changeSteps("Next")}
                            >
                                Next <ArrowRightIcon className="h-5 w-5" />
                            </Button>
                        </div>
                    )}
                </div>

                {/* Create | Update new listing button */}
                {step === 5 &&
                    ((form.title.trim() && !form.referenceId.trim()) ||
                        (isEdited && form.referenceId.trim())) ?
                    <div className="sticky bottom-4 left-0 right-0">
                        <div className="w-full h-full flex justify-center">
                            <CustomButton                                
                                disabled={loading}                                
                            >
                                {form.referenceId.trim() ?
                                    <>
                                        {loading ? <>< Spinner /> Updating Property... </> : "Update Property"}
                                    </> :
                                    <>
                                        {loading ? <>< Spinner /> Submiting Property... </> :
                                            accountType === "ADMIN" ? "Create Property" : "Submit Property"}
                                    </>
                                }
                            </CustomButton>

                        </div>
                    </div> :
                    null
                }
            </form>
            {/* Unsaved Changes Alert */}
            {/* <AlertDialog open={showPrompt} onOpenChange={setShowPrompt}>
                <AlertDialogContent className="sm:max-w-md rounded-2xl">
                    <div className="flex justify-between items-start">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Unsaved changes</AlertDialogTitle>
                            <AlertDialogDescription>
                                You have unsaved data. Save it as a draft before leaving?
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <button onClick={() => setShowPrompt(false)} className="p-1 rounded hover:bg-gray-100">
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    <AlertDialogFooter className="mt-6 gap-2 sm:justify-end">
                        <AlertDialogAction onClick={handleSaveAndLeave} className="bg-blue-600">
                            Save Draft & Leave
                        </AlertDialogAction>
                        <AlertDialogAction onClick={handleLeaveWithoutSaving} className="bg-red-600">
                            Leave Without Saving
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog> */}

        </div>
    );
};


