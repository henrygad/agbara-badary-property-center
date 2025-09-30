"use client";
import { useEffect, useState } from "react";
import { Amenity, Condition, Furnishing, Status, PackageType, PriceFrequency, PropertyCategory, PropertyTypes, PropertyType, SizeUnit, Availability } from "../../types/property.types";
import FormSectionUI from "@/ui/FormSectionUi";
import { AMENITIES, CITIES_LOCAL, CONDITION, FURNISHING, STATUS, PRICE_FREQUENCY, PROPERTY_CATEGORIES, PROPERTY_TYPES, STATES, SIZE_UNIT, AVAILABILITY, DEFAULT_PROPERTY_FORM } from "./data";
import Image from "next/image";
import CustomButton from "@/ui/ButtonUi";
import Modal from "../Modal";
import Galary from "../galary/Index";
import DisplayImage from "../galary/DisplayImage";
import AddImageButton from "./AddImageButton";
import sampleImages from "@/store/images";
import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { addProperty } from "@/lib/firebase/services";

export default function PropertyFormEditor() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [modalGalary, setModalGalary] = useState(false);
    const [selects, setSelects] = useState<string[]>([]);
    const [imageGalary, setImageGalary] = useState<string[]>([]);

    const [form, setForm] = useState<PropertyTypes>(DEFAULT_PROPERTY_FORM);

    function update<K extends keyof typeof form>(
        key: K,
        value: (typeof form)[K]
    ) {
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

    const formatCurrency = (value?: number) => {
        if (!value || isNaN(value)) return "—";
        return `₦${value.toLocaleString()}`;
    };

    const safeValue = (value?: string | number) => {
        if (!value || value === "" || value === 0 || value === Infinity) return "—";
        return value;
    };

    const fiterSEOSlug = (v: string) => {
        let copyV = v;
        copyV = copyV.split(" ").join("-");
        return copyV;
    };

    const normalizeProperty = (data: PropertyTypes): PropertyTypes => {
        const copy = { ...data };
        // Normalize the property data as needed
        for (const key in copy) {
            const value = copy[key as keyof PropertyTypes];
            // You can add normalization logic here if needed
            if (value === null) {
                copy[key] = 0;
            }
        };
        return copy;
    };

    // image preview handler
    function handleImageFiles(files: FileList | null) {
        if (!files) return;
        const arr = Array.from(files);
        // for speed we'll convert to local data URL previews; in production you'd upload to Cloudinary
        arr.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const url = e.target?.result as string;
                // setImages((p) => [...p, url]);
            };
            reader.readAsDataURL(file);
        });
    }

    // placeholder for cloudinary upload - replace with your unsigned upload preset or server signed flow
    async function uploadToCloudinary(file: File) {
        // Example: use unsigned preset
        // const url = `https://api.cloudinary.com/v1_1/<CLOUD_NAME>/upload`;
        // const formData = new FormData();
        // formData.append('file', file);
        // formData.append('upload_preset', '<UPLOAD_PRESET>');
        // const res = await fetch(url, { method: 'POST', body: formData });
        // const data = await res.json();
        // return form.secure_url;
        return "https://via.placeholder.com/600x400?text=Uploaded+Image";
    }

    async function submitForm(e?: React.FormEvent) {
        e?.preventDefault();
        setLoading(true);
        try {
            // validate essential fields
            if (!form.title || !form.price || !form.city) {
                alert("Please complete title, price and city");
                setLoading(false);
                return;
            }

            // Example: upload images to Cloudinary - here we just simulate
            // const uploaded = [] as string[];
            // for (const file of filesToUpload) {
            //   const url = await uploadToCloudinary(file);
            //   uploaded.push(url);
            // }

            // Prepare payload for your API or Firestore
            const payload: PropertyTypes = {
                ...form,
                referenceId: `AGB-${Date.now()}`,
            };

            //const getProperties = JSON.parse(localStorage.getItem("properties") || "[]") as PropertyTypes[];

            // localStorage.setItem("properties", JSON.stringify([payload, ...getProperties]));
            // console.log("PAYLOAD", payload);
            // TODO: send payload to your backend or Firestore

            await addProperty(payload);


            //setForm(DEFAULT_PROPERTY_FORM);
            //alert("Listing saved (console shows payload)");
            //setStep(1);
        } catch (err) {
            console.error(err);
            alert("Error saving listing");
        } finally {
            setLoading(false);
        }
    }

    // Load sample images on mount
    useEffect(() => {
        setImageGalary(sampleImages);
    }, []);

    // Get duplicate data from localStorage
    useEffect(() => {
        // Check if duplicate data is present
        const duplicate = localStorage.getItem("duplicateProperty");

        if (duplicate) {
            const parsed = JSON.parse(duplicate) as PropertyTypes;
            // clear the  UID so it will generate a new one
            // parsed.id = "";
            // parsed.referenceId = "";

            setForm(normalizeProperty(parsed));
            localStorage.removeItem("duplicateProperty");
        };
    }, []);

    // Get update data from localStorage
    useEffect(() => {
        // Check if update data is present
        const update = localStorage.getItem("updateProperty");

        if (update) {
            const parsed = JSON.parse(update) as PropertyTypes;
            setForm(normalizeProperty(parsed));
            localStorage.removeItem("updateProperty");
        };
    }, []);

    return (
        <div className="w-full bg-inherit">
            {/* Steps */}
            <menu className="mb-6">
                <ul className="flex items-center gap-2 text-sm text-gray-600">
                    <li
                        className={`px-3 py-1 rounded-full ${step === 1 ? "bg-blue-600 text-white" : "bg-gray-100 cursor-pointer"}`}
                        onClick={() => setStep(1)}
                    >
                        1
                    </li>
                    <li
                        className={`px-3 py-1 rounded-full ${step === 2 ? "bg-blue-600 text-white" : "bg-gray-100 cursor-pointer"}`}
                        onClick={() => setStep(2)}
                    >
                        2
                    </li>
                    <li
                        className={`px-3 py-1 rounded-full ${step === 3 ? "bg-blue-600 text-white" : "bg-gray-100 cursor-pointer "}`}
                        onClick={() => setStep(3)}
                    >
                        3
                    </li>
                    <li
                        className={`px-3 py-1 rounded-full ${step === 4 ? "bg-blue-600 text-white" : "bg-gray-100 cursor-pointer"}`}
                        onClick={() => setStep(4)}
                    >
                        4
                    </li>
                    <li
                        className={`px-3 py-1 rounded-full ${step === 5 ? 'bg-blue-600 text-white' : 'bg-gray-100 cursor-pointer'}`}
                        onClick={() => setStep(5)}
                    >
                        5
                    </li>
                </ul>
            </menu>
            {/* Property form editor */}
            <form
                onSubmit={submitForm}
                className="space-y-6"
            >
                {/* Basic info */}
                {step === 1 && (
                    <FormSectionUI title="Basic Info">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="" className="block text-sm font-medium mb-1">
                                    Title
                                </label>
                                <input
                                    value={form.title}
                                    onChange={(e) => {
                                        update("title", e.target.value);
                                        update("seoSlug", fiterSEOSlug(e.target.value))
                                    }}
                                    className="w-full p-3 border rounded text-sm"
                                    placeholder="3-Bedroom Flat for Rent in Agbara Estate"
                                />
                            </div>

                            <div>
                                <label htmlFor="category" className="block text-sm font-medium mb-1">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    value={form.category}
                                    onChange={(e) => update("category", e.target.value as PropertyCategory)}
                                    className="w-full p-3 border rounded text-sm"
                                >
                                    {PROPERTY_CATEGORIES.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="property-type" className="block text-sm font-medium mb-1">
                                    Property Type
                                </label>
                                <select
                                    id="property-type"
                                    value={form.type}
                                    onChange={(e) => update("type", e.target.value as PropertyType)}
                                    className="w-full p-3 border rounded text-sm"
                                >
                                    {PROPERTY_TYPES.map((t) => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Property Status
                                </label>
                                <select
                                    value={form.status}
                                    onChange={(e) => update("status", e.target.value as Status)}
                                    className="w-full p-3 border rounded text-sm"
                                >
                                    {STATUS.map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => update("description", e.target.value)}
                                    rows={6}
                                    className="w-full p-3 border rounded text-sm"
                                    placeholder="Provide full description, nearby landmarks, special conditions, etc."
                                />
                            </div>
                        </div>
                    </FormSectionUI>
                )}

                {/* Location & Pricing */}
                {step === 2 && (
                    <FormSectionUI title="Location & Pricing">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">State</label>
                                <select
                                    value={form.state}
                                    onChange={(e) => update("state", e.target.value)}
                                    className="w-full p-3 border rounded text-sm"
                                >
                                    {STATES.map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    City / Locality
                                </label>
                                <select
                                    value={form.city}
                                    onChange={(e) => update("city", e.target.value)}
                                    className="w-full p-3 border rounded text-sm"
                                >
                                    {CITIES_LOCAL.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Area / Street
                                </label>
                                <input
                                    value={form.area}
                                    onChange={(e) => update("area", e.target.value)}
                                    className="w-full p-3 border rounded text-sm"
                                    placeholder="Agbara Estate"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Street Address
                                </label>
                                <input
                                    value={form.street}
                                    onChange={(e) => update("street", e.target.value)}
                                    className="w-full p-3 border rounded text-sm"
                                    placeholder="House 12, Block A"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Landmark
                                </label>
                                <input
                                    value={form.landmark}
                                    onChange={(e) => update("landmark", e.target.value)}
                                    className="w-full p-3 border rounded text-sm"
                                    placeholder="Near Vesper School"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Map Coordinates (lat,long)
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        value={form.latitude}
                                        onChange={(e) => update("latitude", Number(e.target.value))}
                                        className="w-1/2 p-3 border rounded text-sm"
                                        placeholder="6.45"
                                        type="number"
                                    />
                                    <input
                                        value={form.longitude}
                                        onChange={(e) => update("longitude", Number(e.target.value))}
                                        className="w-1/2 p-3 border rounded text-sm"
                                        placeholder="3.2"
                                        type="number"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Tip: Use an external map picker to get coordinates, or
                                    implement Mapbox/Google Maps pin later.
                                </p>
                            </div>

                            <div className="md:col-span-3 space-y-4">
                                <div className="flex gap-2 items-center">
                                    <div className="flex-1 flex flex-col">
                                        <label className="block text-sm font-medium mb-1">Price</label>
                                        <input
                                            value={form.price}
                                            onChange={(e) => update("price", Number(e.target.value))}
                                            className="flex-1 p-3 border rounded text-sm"
                                            placeholder="600,000"
                                            type="number"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Frequency</label>
                                        <select
                                            value={form.priceFrequency}
                                            onChange={(e) => update("priceFrequency", e.target.value as PriceFrequency)}
                                            className="block p-3 border rounded text-sm"
                                        >
                                            {PRICE_FREQUENCY.map((p) => (
                                                <option key={p} value={p}>
                                                    {p}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 ">
                                    <div className="flex flex-col">
                                        <label className="block text-sm font-medium mb-1">Service Charge</label>
                                        <input
                                            value={form.serviceCharge}
                                            onChange={(e) => update("serviceCharge", Number(e.target.value))}
                                            className="flex-1 p-3 border rounded text-sm"
                                            placeholder="20,000"
                                            type="number"
                                        />

                                    </div>
                                    <div className="flex flex-col">
                                        <label className="block text-sm font-medium mb-1">Agency Fee</label>
                                        <input
                                            value={form.agencyFee}
                                            onChange={(e) => update("agencyFee", Number(e.target.value))}
                                            className="flex-1 p-3 border rounded text-sm"
                                            placeholder="100,000"
                                            type="number"
                                        />

                                    </div>
                                    <div className="flex flex-col">
                                        <label className="block text-sm font-medium mb-1">Legal Fee</label>
                                        <input
                                            value={form.legalFee}
                                            onChange={(e) => update("legalFee", Number(e.target.value))}
                                            className="flex-1 p-3 border rounded text-sm"
                                            placeholder="10,0000"
                                            type="number"
                                        />

                                    </div>
                                </div>

                                <div className="flex items-center gap-4 mt-2">
                                    <label className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={form.negotiable}
                                            onChange={(e) => update("negotiable", e.target.checked)}
                                        />{" "}
                                        Negotiable
                                    </label>
                                </div>
                            </div>

                        </div>
                    </FormSectionUI>
                )}

                {/* Property Details & Amenities */}
                {step === 3 && (
                    <FormSectionUI title=" Property Details & Amenities">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Bedrooms
                                </label>
                                <input
                                    type="number"
                                    value={form.bedrooms}
                                    onChange={(e) => update("bedrooms", Number(e.target.value))}
                                    className="w-full p-3 border rounded text-sm"
                                    placeholder="3"
                                    min={0}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Bathrooms
                                </label>
                                <input
                                    type="number"
                                    value={form.bathrooms}
                                    onChange={(e) => update("bathrooms", Number(e.target.value))}
                                    className="w-full p-3 border rounded text-sm"
                                    placeholder="3"
                                    min={0}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Toilets
                                </label>
                                <input
                                    type="number"
                                    value={form.toilets}
                                    onChange={(e) => update("toilets", Number(e.target.value))}
                                    className="w-full p-3 border rounded text-sm"
                                    placeholder="4"
                                    min={0}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Parking Spaces
                                </label>
                                <input
                                    type="number"
                                    value={form.parkingSpaces}
                                    onChange={(e) => update("parkingSpaces", Number(e.target.value))}
                                    className="w-full p-3 border rounded text-sm"
                                    placeholder="2"
                                    min={0}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Parking Capacity
                                </label>
                                <input
                                    type="number"
                                    value={form.parkingCapacity}
                                    onChange={(e) => update("parkingCapacity", Number(e.target.value))}
                                    className="w-full p-3 border rounded text-sm"
                                    placeholder="15"
                                    min={0}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Furnishing
                                </label>
                                <select
                                    value={form.furnishing}
                                    onChange={(e) => update("furnishing", e.target.value as Furnishing)}
                                    className="w-full p-3 border rounded text-sm"
                                >
                                    {FURNISHING.map((f) => (
                                        <option key={f} value={f}>
                                            {f}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Condition
                                </label>
                                <select
                                    value={form.condition}
                                    onChange={(e) => update("condition", e.target.value as Condition)}
                                    className="w-full p-3 border rounded text-sm"
                                >
                                    {CONDITION.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Property Size
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={form.size}
                                        onChange={(e) => update("size", Number(e.target.value))}
                                        className="flex-1 p-3 border rounded text-sm w-0"
                                        placeholder="120"
                                    />
                                    <select
                                        value={form.sizeUnit}
                                        onChange={(e) => update("sizeUnit", e.target.value as SizeUnit)}
                                        className="p-3 border rounded"
                                    >
                                        {
                                            SIZE_UNIT.map(v =>
                                                <option value={v} key={v}>{v}</option>
                                            )
                                        }
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Year Built
                                </label>
                                <input
                                    value={form.yearBuilt}
                                    onChange={(e) => update("yearBuilt", Number(e.target.value))}
                                    className="w-full p-3 border rounded text-sm"
                                    placeholder="2015"
                                    type="number"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Floor Level
                                </label>
                                <input
                                    value={form.floorLevel}
                                    onChange={(e) => update("floorLevel", e.target.value)}
                                    className="w-full p-3 border rounded text-sm"
                                    placeholder="Ground / 1st / 2nd"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Total Floors
                                </label>
                                <input
                                    value={form.totalFloors}
                                    onChange={(e) => update("totalFloors", Number(e.target.value))}
                                    className="w-full p-3 border rounded text-sm"
                                    placeholder="3"
                                    type="number"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Floor Area
                                </label>
                                <input
                                    value={form.floorArea}
                                    onChange={(e) => update("floorArea", Number(e.target.value))}
                                    className="w-full p-3 border rounded text-sm"
                                    placeholder="2000"
                                    type="number"
                                />
                            </div>

                            <div className="md:col-span-3">
                                <label className="block text-sm font-medium mb-1">
                                    Amenities
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {AMENITIES.map((amen) => (
                                        <label
                                            key={amen}
                                            className={`p-2 border rounded flex items-center gap-2 ${form.amenities.includes(amen)
                                                ? "bg-blue-50 border-blue-300"
                                                : ""
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={form.amenities.includes(amen)}
                                                onChange={() => toggleAmenity(amen)}
                                            />
                                            <span className="text-sm">{amen}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </FormSectionUI>
                )}

                {/* Media & Agent Info */}
                {step === 4 && (
                    <FormSectionUI title="Media & Agent Details">
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Property Images
                                </label>
                                <div className="mt-3 flex max-w-full scroll-smooth overflow-x-auto overflow-y-hidden bg-slate-50 rounded-sm px-4 py-2">
                                    <div className="flex justify-start items-center gap-4">
                                        {
                                            form.images?.length ?
                                                form.images.map((src, idx) => (
                                                    <DisplayImage
                                                        key={idx}
                                                        className="w-[100px] h-[100px]"
                                                        img={src}
                                                        remove={(i) => {
                                                            update("images", form.images.filter(fi => fi !== i));
                                                        }}
                                                    />
                                                )) :
                                                null
                                        }
                                        <AddImageButton
                                            onClick={() => setModalGalary(true)}
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Tip: You should upload images to Cloudinary or S3 and sto re
                                    URLs. This demo uses local previews only.
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Video / Virtual Tour Link (optional)
                                </label>
                                <input
                                    value={form.videoUrl}
                                    onChange={(e) => update("videoUrl", e.target.value)}
                                    placeholder="YouTube link or 360 tour URL"
                                    className="w-full p-3 border rounded text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 mt-4">
                                    Agent / Owner
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        value={form.agentName}
                                        onChange={(e) => update("agentName", e.target.value)}
                                        className="w-full p-3 border rounded mb-2 text-sm"
                                        placeholder="Agent name"
                                    />
                                    <input
                                        value={form.agentPhone}
                                        onChange={(e) => update("agentPhone", Number(e.target.value))}
                                        className="w-full p-3 border rounded mb-2 text-sm"
                                        placeholder="Phone number"
                                        type="number"
                                    />
                                    <input
                                        value={form.agentEmail}
                                        onChange={(e) => update("agentEmail", e.target.value)}
                                        className="w-full p-3 border rounded mb-2 text-sm"
                                        placeholder="Email"
                                    />
                                    <input
                                        value={form.agentCompany}
                                        onChange={(e) => update("agentCompany", e.target.value)}
                                        className="w-full p-3 border rounded mb-2 text-sm"
                                        placeholder="Company name"
                                    />
                                    <label className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={form.showContact}
                                            onChange={(e) => update("showContact", e.target.checked)}
                                        />{" "}
                                        Show contact publicly
                                    </label>
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col mt-4">
                                <label className="block text-sm font-medium mb-4">
                                    Meta / Listing Management
                                </label>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 items-center">
                                    {/* SEO Slug */}
                                    <div className="flex-1 flex flex-col col-span-2">
                                        <label htmlFor="seoSlug" className="block text-xs font-medium mb-1">SEO Slug</label>
                                        <input
                                            id="seoSlug"
                                            placeholder="3-bedroom-flat-agbara"
                                            value={form.seoSlug}
                                            // onChange={(e) => update("seoSlug", e.target.value)}
                                            className="p-3 border rounded flex-1 text-sm"
                                            readOnly
                                        />
                                        <p className="text-xs text-gray-500 block mt-1">Used for clean property URLs</p>
                                    </div>

                                    {/* Reference ID */}
                                    <div className="flex flex-col">
                                        <label htmlFor="referenceId" className="block text-xs font-medium mb-1">
                                            Reference ID
                                        </label>
                                        <input
                                            id="referenceId"
                                            placeholder="AGB-20250922-001"
                                            value={form.referenceId}
                                            onChange={(e) => update("referenceId", e.target.value)}
                                            readOnly
                                            className="p-3 border rounded flex-1 text-sm"
                                        />
                                    </div>

                                    {/* Listing Status */}
                                    <div className="flex flex-col">
                                        <label className="block text-xs font-medium mb-1">Availability</label>
                                        <select
                                            value={form.availability}
                                            onChange={(e) => update("availability", e.target.value as Availability)}
                                            className="p-3 border rounded text-sm"
                                        >
                                            {
                                                AVAILABILITY.map(v =>
                                                    <option value={v} key={v}>{v}</option>
                                                )
                                            }
                                        </select>
                                    </div>

                                    {/* Package Type */}
                                    <div className="flex flex-col">
                                        <label className="block text-xs font-medium mb-1">Package Type</label>
                                        <select
                                            value={form.packageType}
                                            onChange={(e) => update("packageType", e.target.value as PackageType)}
                                            className="p-3 border rounded text-sm"
                                        >
                                            <option value="free">Free</option>
                                            <option value="premium">Premium</option>
                                            <option value="featured">Featured</option>
                                        </select>
                                    </div>

                                    {/* Priority Rank */}
                                    <div className="flex flex-col">
                                        <label htmlFor="priorityRank" className="block text-xs font-medium mb-1">Priority Rank</label>
                                        <input
                                            id="priorityRank"
                                            type="number"
                                            min={1}
                                            max={10}
                                            placeholder="1-10"
                                            value={form.priorityRank}
                                            onChange={(e) => update("priorityRank", Number(e.target.value))}
                                            className="p-3 border rounded flex-1 text-sm"

                                        />
                                        {/* <p className="text-xs text-gray-500">Higher rank = appears earlier in search results</p> */}
                                    </div>

                                    {/* Date Listed */}
                                    <div className="flex flex-col">
                                        <label htmlFor="createdAt" className="block text-xs font-medium mb-1">Date Listed</label>
                                        <input
                                            id="createdAt"
                                            type="date"
                                            // defaultValue={new Date().toISOString().slice(0, 10)}
                                            value={form.createdAt as string}
                                            onChange={(e) => update("createdAt", e.target.value)}
                                            className="p-3 border rounded flex-1 text-sm"
                                        />
                                    </div>

                                    {/* Last Updated */}
                                    <div className="flex flex-col">
                                        <label htmlFor="updatedAt" className="block text-xs font-medium mb-1">Last Updated</label>
                                        <input
                                            id="updatedAt"
                                            type="date"
                                            // defaultValue={new Date().toISOString().slice(0, 10)}
                                            value={form.updatedAt as string}
                                            onChange={(e) => update("updatedAt", e.target.value)}
                                            className="p-3 border rounded flex-1 text-sm"
                                        />
                                    </div>

                                </div>

                            </div>

                        </div>
                    </FormSectionUI>
                )}

                {/* Preview & Confirm */}
                {step === 5 && (
                    <FormSectionUI title="Preview Your Listing">
                        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                            {/* Gallery Slider */}
                            {form.images?.length ? (
                                <Carousel className="w-full">
                                    <CarouselContent>
                                        {form.images.map((url, i) => (
                                            <CarouselItem key={i}>
                                                <div className="relative w-full h-80">
                                                    <Image
                                                        key={i}
                                                        src={url}
                                                        alt={`preview-${i}`}
                                                        fill
                                                        className="w-full  h-80  object-cover rounded-lg shadow-sm"
                                                    />
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious type="button" className="h-20 w-20 cursor-pointer  text-red-700 bg-amber-500" />
                                    <CarouselNext type="button" className="h-20 w-20 cursor-pointer text-red-700 bg-amber-500" />
                                </Carousel>
                            ) : (
                                <div className="w-full h-72 bg-gray-100 flex items-center justify-center text-gray-500">
                                    No Image Uploaded
                                </div>
                            )}

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                {/* Title & Price */}
                                <div>
                                    <div className="flex justify-between flex-wrap items-center gap-4">
                                        <h1 className="text-2xl font-bold text-gray-800">
                                            {form.title || "Untitled Property"}
                                        </h1>
                                        <p className="text-xl font-semibold text-green-700">
                                            {formatCurrency(form.price)}{" "}
                                            {form.priceFrequency && form.priceFrequency !== "Total"
                                                ? ` / ${form.priceFrequency}`
                                                : ""}
                                        </p>
                                    </div>
                                    <p className="text-sm font-medium text-wrap px-1 py-3 text-slate-700">
                                        {form.description || "Provide description"}
                                    </p>
                                </div>

                                {/* Fees */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700">
                                    <p><strong>Service Charge</strong>: {formatCurrency(form.serviceCharge)}</p>
                                    <p><strong>Agency Fee</strong>: {formatCurrency(form.agencyFee)}</p>
                                    <p><strong>Legal Fee</strong>: {formatCurrency(form.legalFee)}</p>
                                    <p><strong>Status</strong>: {safeValue(form.status)}</p>
                                </div>

                                {/* Meta Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-1">
                                        <p>
                                            <strong>Availability:</strong> {form.title.trim() ? safeValue(form.availability) : "-"}
                                        </p>
                                        <p>
                                            <strong>Priority Rank:</strong> {form.title.trim() ? safeValue(form.priorityRank) : "-"}
                                        </p>
                                        <p>
                                            <strong>Ref ID:</strong> {form.availability != "Draft" && safeValue(form.referenceId)}
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
                                            <strong>Parking Spaces:</strong> {safeValue(form.parkingSpaces)}
                                        </p>
                                        <p>
                                            <strong>Parking Capacity:</strong> {safeValue(form.parkingCapacity)}
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
                                        <strong>Total Floors:</strong> {safeValue(form.totalFloors)}
                                    </p>
                                    <p>
                                        <strong>Floor Area:</strong> {safeValue(form.floorArea)}
                                    </p>
                                    <p>
                                        <strong>Year Built:</strong> {safeValue(form.yearBuilt)}
                                    </p>
                                    <p>
                                        <strong>Size:</strong>{" "}
                                        {safeValue(form.size)} {safeValue(form.size) !== "—" && safeValue(form.sizeUnit)}
                                    </p>
                                </div>

                                {/* Amenities */}
                                <div>
                                    <h2 className="font-semibold text-gray-800 mb-2">Amenities</h2>
                                    {form.amenities?.length ? (
                                        <ul className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                                            {form.amenities.map((a, i) => (
                                                <li key={i} className="flex items-center gap-2">
                                                    ✅ {a}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500 text-sm">No amenities specified</p>
                                    )}
                                </div>

                                {/* Agent Info */}
                                <div>
                                    <h2 className="font-semibold text-gray-800 mb-2">
                                        Agent Information
                                    </h2>
                                    <p className="text-sm font-medium text-slate-700">
                                        {safeValue(form.agentName)} | {safeValue(form.agentPhone)} |{" "}
                                        {safeValue(form.agentEmail)}
                                    </p>
                                    <p className="text-sm font-medium text-slate-700">{safeValue(form.agentCompany)}</p>
                                </div>

                                {/* Dates */}
                                <div className="text-sm text-gray-500 border-t pt-3">
                                    <p>
                                        Date Listed:{" "}
                                        {form.createdAt
                                            ? new Date(form.createdAt).toLocaleDateString()
                                            : "—"}
                                    </p>
                                    <p>
                                        Last Updated:{" "}
                                        {form.updatedAt
                                            ? new Date(form.updatedAt).toLocaleDateString()
                                            : "—"}
                                    </p>
                                </div>

                                {/* Seo Slug */}
                                <div className="mt-2">
                                    <p className="text-xs text-slate-700">{safeValue(form.seoSlug)}</p>
                                </div>
                            </div>
                        </div>
                    </FormSectionUI>
                )}

                <div className="flex items-center justify-between">
                    {step > 1 && (
                        <CustomButton
                            type="button"
                            onClick={() => setStep((s) => s - 1)}
                            className="rounded-2xl stroke-slate-800 bg-slate-200"
                        >
                            Back
                        </CustomButton>
                    )}
                    {step < 5 && (
                        <div className="flex justify-end items-center w-full">
                            <CustomButton
                                type="button"
                                onClick={() => setStep((s) => s + 1)}
                                className="bg-blue-600 text-white rounded-2xl"
                            >
                                Next
                            </CustomButton>
                        </div>
                    )}

                </div>

                <div className="w-full flex justify-center items-center mt-10">
                    {step === 5 && <div>
                        <CustomButton
                            type="submit"
                            disabled={loading}
                            className="bg-green-700 text-white rounded-lg font-bold px-24"
                        >
                            {loading ? "Sending..." : "Send Listing"}
                        </CustomButton>
                    </div>
                    }
                </div>

            </form>

            {/* Image Galary Modal */}
            <Modal
                isOpen={modalGalary}
                setIsOpen={setModalGalary}
            >
                <div className="w-full flex flex-col min-h-screen bg-white">
                    {/*Modal Header */}
                    <div className="flex justify-between items-center h-[7vh] px-2 border border-slate-400 shadow">
                        <div className="flex items-center gap-10">
                            <button
                                className="inline-block text-base font-bold text-red-900 cursor-pointer"
                                onClick={() => {
                                    setSelects([]);
                                    setModalGalary(false);
                                }}
                            >
                                X
                            </button>
                            <span className="inline-block">
                                <h2>Image Galary</h2>
                            </span>
                        </div>
                        {selects.length ? <div>
                            <h5>Selected {selects.length}</h5>
                        </div> : null}
                    </div>
                    {/* Modal body */}
                    <div className="flex-1 max-h-full overflow-y-auto overflow-x-hidden p-8">
                        <Galary
                            imageGalary={imageGalary}
                            setImageGalary={setImageGalary}
                            selects={selects}
                            setSelects={setSelects}
                        />
                    </div>
                    {/* Modal footer */}
                    <div className="py-4 pr-2 border border-slate-400 shadow h-[7vh]">
                        <div className="flex-1 flex justify-end items-center">
                            <CustomButton
                                type="button"
                                onClick={() => {
                                    update("images", [...form.images, ...selects]);
                                    setSelects([]);
                                    setModalGalary(false);
                                }}
                            >
                                Add
                            </CustomButton>
                        </div>
                    </div>
                </div>
            </Modal >
        </div >
    );
};

// swiper.js courosel.