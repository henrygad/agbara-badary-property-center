"use client";
import { ReactNode, useEffect, useState } from "react";
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
} from "../../types/property.types";
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
    DEFAULT_PROPERTY_FORM,
    PACKAGE_TYPE,
} from "./defaultData";
import DisplayImage from "../gallery/DisplayImage";
import React from "react";
import {
    addPropertyDb,
    updatePropertyDb,
} from "@/lib/firebase/property_service";
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
import { CustomCalendar } from "../CustomCalader";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import GalleryModal from "../gallery/Index";
import { ArrowLeftIcon, ArrowRightIcon, X } from "lucide-react";
import { showError, showSuccess } from "../ui/toasts";
import { fiterSEOSlug } from "@/utils";
import { usePropertyStore } from "@/store/usePropertyStore";
import { useRouter } from "next/navigation";
import FormButton from "./FormButton";
import PageLoading from "../loaders/PageLoader";
import useUnsavedChanges from "@/hooks/useUnsavedChanges";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../ui/alert-dialog";
import Property from "../property/Index";
import { useUserStore } from "@/store/useUserStore";
import { Card } from "../ui/card";
import OverlayLoader from "../loaders/OverlayLoader";
import { addNotificationDb } from "@/lib/firebase/notification._service";
import NotificationTypes from "@/types/notification.types";
import { PendingApprovalDialog } from "../PendingApprovalDialog";

type Props = {
    accountType: "ADMIN" | "AGENT";
    documentType: "NEW" | "UPDATE" | "DUPLICATE" | "DRAFT" | "REVIEW";
    loadingForm: boolean;
    setLoadingForm: (l: boolean) => void;
};

export default function PropertyFormEditor({
    accountType,
    loadingForm,
    documentType,
}: Props) {

    const { user, loading: loadingUser } = useUserStore();
    const { addProperty, form, setForm, updateProperty } = usePropertyStore();

    const [pendingAgentDialogOpen, setpendingAgentDialogOpen] = useState(false);

    const router = useRouter();
    const [step, setStep] = useState(1);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<{ errorMsg: string; isError: boolean }>({
        errorMsg: "",
        isError: false,
    });

    const [isDocEdited, setIsDocEdited] = useState(false);

    const [chooseCities, setChooseCities] = useState<string[]>(
        REGIONAL_TOWNS[0].cities
    );

    // Form is not empty
    const isFormDirty =
        Object.values({
            title: form.title.trim(),
            description: form.description.trim(),
            seoSlug: form.seoSlug.trim(),
            price: !form.price ? "" : form.price,
            state: form.state.trim(),
            category: form.category.trim(),
            type: form.type.trim(),
            satus: form.status.trim(),
            images: form.images.length ? form.images.join(".trim(),") : "",
            videoUrl: form.videoUrl?.trim(),
        }).some((val) => val !== "") && isDocEdited;

    // Intecept navigation if form is dirty
    const { openPrompt, setOpenPrompt, leaveWithoutSaving, saveDraftAndLeave } =
        useUnsavedChanges({
            when: isFormDirty,
            onSaveDraft: handleSaveDraft,
            guardedPaths: user?.accountType === "Admin" ?
                ["/admin/add-property", "/admin/edit-property"] :
                ["/agent/add-property", "/agent/edit-property"],
        });

    // Populate agent details if account type is agent
    useEffect(() => {
        if (user) {
            setForm((s) => ({
                ...s,
                agentName: user.firstName + " " + user.lastName,
                agentEmail: user?.email || "",
                agentPhoto: user?.profileImage?.url || "",
                agentPhone: user?.phoneCode + user?.phone || "",
                agentCompany: user?.company || "",
                accountType: user?.accountType,
                agentId: user?.id || "",
                availability: user.accountType === "Admin" ? "Accepted" : "Pending",
            }));
        }
    }, [user, setForm]);


    if (loadingForm || loadingUser)
        return (
            <PageLoading loading={loadingForm || loadingUser} />
        );

    function handleSaveDraft() {
        const drafts = JSON.parse(
            localStorage.getItem("drafts") || "[]"
        ) as PropertyTypes[]

        localStorage.setItem(
            "drafts",
            JSON.stringify([
                ...drafts,
                { ...form, draftId: String(Date.now() + Math.random()) },
            ])
        );
        setForm(() => DEFAULT_PROPERTY_FORM);
        showSuccess("Draft saved!", "Draft have been saved locally");
    }

    function update<K extends keyof typeof form>(
        key: K,
        value: (typeof form)[K]
    ) {
        // When data passed to form is edited
        if (!isDocEdited) {
            setIsDocEdited(true);
        }

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
            setStep((s) => s - 1);
        } else if (p === "Next") {
            setStep((s) => s + 1);
        } else {
            setStep(p);
        }
        window.scrollTo(0, 0);
    }

    const handleDeleteDraft = (draftId?: string) => {
        if (!draftId) return;

        const draft = JSON.parse(localStorage.getItem("drafts") || "[]") as PropertyTypes[];
        if (draft.length) {
            localStorage.setItem(
                "drafts",
                JSON.stringify(draft.filter(d => d.draftId !== draftId))
            );
        }

    };

    async function submitNewProperty(payload: PropertyTypes) {
        // Simulate API call
        const property = await addPropertyDb(payload);
        if (property) {
            addProperty(property);
            return property;
        }
        return null

    }

    async function submitUpdatedProperty(payload: PropertyTypes) {
        if (!payload.id) {
            throw new Error("Need property id to updated property!");
        }
        // Simulate API call
        const property = await updatePropertyDb(payload.id, payload);
        if (property) {
            updateProperty(property);

            // Return user back
            //const clearOut =
            setTimeout(() => {
                router.back();
                //clearTimeout(clearOut);
            }, 500);

            return property;
        }
        return null;
    }

    async function submitReviewedProperty(payload: PropertyTypes) {
        if (!payload.id) {
            throw new Error("Need property id to updated property!");
        }

        // Simulate API call
        const property = await updatePropertyDb(payload.id, payload);
        if (property) {
            updateProperty(property);

            // Return user back
            //const clearOut =
            setTimeout(() => {
                router.back();
                // clearTimeout(clearOut);
            }, 500);

            return property;
        }

        return null;
    }

    // form submission handler (create new property listing to firestore)
    async function submitForm(e?: React.FormEvent) {
        e?.preventDefault();

        if (user?.accountStatus !== "Approved") {
            setpendingAgentDialogOpen(true);
            return;
        }

        if (loading) return;

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

            let property: PropertyTypes | null = null;

            if (documentType === "NEW") {
                property = await submitNewProperty(payload);
                if (user?.accountType === "Agent") {
                    const payload: NotificationTypes = {
                        type: "Property",
                        to: "Admin",
                        title: `New property by ${user.firstName} ${user.lastName}.`,
                        message: `A new property - ${property?.referenceId} has been listed by ${user.firstName} ${user.lastName}, and waiting admin aprroval.`,
                        viewed: false,
                        createdAt: new Date()
                    };
                    await addNotificationDb(payload);
                }
            } else if (documentType === "UPDATE" && payload.referenceId) {
                property = await submitUpdatedProperty(payload);
                if (user?.accountType === "Agent") {
                    const payload: NotificationTypes = {
                        type: "Property",
                        to: "Admin",
                        title: `Property updated by ${user.firstName} ${user.lastName}.`,
                        message: `Property -${property?.referenceId} was updated by ${user.firstName} ${user.lastName}, and waiting admin approval.`,
                        viewed: false,
                        createdAt: new Date()
                    };
                    await addNotificationDb(payload);
                }
            } else if (documentType === "REVIEW" && payload.referenceId) {
                property = await submitReviewedProperty(payload);
            }

            if (!property) return;
            // Simulate successful response

            // Was a drafted property
            const draftId = payload.draftId;
            if (draftId) {
                handleDeleteDraft(draftId);
            }

            let heading = "";
            let description = "";

            if (accountType === "AGENT") {
                heading = "Property Submitted!";
                description = "Your listing has been succesfully submitted for review.";
            }

            if (accountType === "ADMIN") {
                heading = "Property Added!";
                description = "Your listing is now live.";
            }

            if (documentType === "UPDATE" || documentType === "REVIEW") {
                heading = "Property Updated!";
                description = "Listing has been succesfully updated.";
            }

            showSuccess(heading, description);

            setForm(() => {
                if (!user) {
                    return DEFAULT_PROPERTY_FORM;
                }

                return {
                    ...DEFAULT_PROPERTY_FORM,
                    agentName: user.firstName + " " + user.lastName,
                    agentEmail: user?.email || "",
                    agentPhone: user?.phoneCode + user?.phone || "",
                    agentCompany: user?.company || "",
                };
            });

            setError({ errorMsg: "", isError: false });

            setStep(1);
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
    };

    return (
        <div className="w-full bg-inherit">
            {/* Steps */}
            <menu className="mb-6">              
                <div className="flex gap-2">
                    {Array(5)
                        .fill("")
                        .map((_, idx) => (
                            <Button
                                key={idx + 1}
                                variant={step === idx + 1 ? "destructive" : "outline"}
                                size="icon"
                                className="rounded-full cursor-pointer"
                                onClick={() => setStep(idx + 1)}
                            >
                                {idx + 1}
                            </Button>
                        ))}
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
                                <Label
                                    htmlFor="category"
                                    className="block text-sm font-medium mb-1"
                                >
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
                                        id="category"
                                        className={`w-full cursor-pointer
                                        ${error.errorMsg.toLowerCase().includes("category") ? "border-red-600" : ""}
                                        `}
                                    >
                                        <SelectValue placeholder="Select a category" />
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
                                <Label
                                    htmlFor="type"
                                    className="block text-sm font-medium mb-1"
                                >
                                    Type
                                </Label>
                                <Select
                                    value={form.type}
                                    onValueChange={(value) =>
                                        update("type", value as PropertyType)
                                    }
                                >
                                    <SelectTrigger
                                        id="type"
                                        className={`w-full cursor-pointer
                                        ${error.errorMsg.toLowerCase().includes("type") ? "border-red-600" : ""}
                                        `}
                                    >
                                        <SelectValue placeholder="Select a type" />
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
                                <Label
                                    htmlFor="status"
                                    className="block text-sm font-medium mb-1"
                                >
                                    Status
                                </Label>
                                <Select
                                    value={form.status}
                                    onValueChange={(value) => update("status", value as Status)}
                                >
                                    <SelectTrigger
                                        id="status"
                                        className={`w-full cursor-pointer
                                        ${error.errorMsg.toLowerCase().includes("status") ? "border-red-600" : ""}
                                        `}
                                    >
                                        <SelectValue placeholder="Select a status" />
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
                                <Label
                                    htmlFor="description"
                                    className="block text-sm font-medium mb-1"
                                >
                                    Description
                                </Label>
                                <Textarea
                                    id="description"
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
                                <Label
                                    htmlFor="state"
                                    className="block text-sm font-medium mb-1"
                                >
                                    State
                                </Label>
                                <Select
                                    value={form.state}
                                    onValueChange={(value) => {
                                        update("state", value);
                                        setChooseCities(REGIONAL_TOWNS.find(r => r.state === value)?.cities || []);
                                    }}
                                >
                                    <SelectTrigger
                                        id="state"
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
                                            >
                                                {state.state}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* City */}
                            <div>
                                <Label
                                    htmlFor="city"
                                    className="block text-sm font-medium mb-1"
                                >
                                    City
                                </Label>
                                <Select
                                    value={form.city}
                                    onValueChange={(value) => update("city", value)}
                                >
                                    <SelectTrigger
                                        id="city"
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
                                <Label htmlFor="area" className="text-sm font-medium mb-1">
                                    Area
                                </Label>
                                <Input
                                    id="area"
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
                                <Label htmlFor="street" className="text-sm font-medium mb-1">
                                    Street Address
                                </Label>
                                <Input
                                    id="street"
                                    value={form.street ?? ""}
                                    onChange={(e) => update("street", e.target.value)}
                                    className="w-full"
                                    placeholder="House 12, Block A"
                                />
                            </div>

                            {/* Landmark */}
                            <div>
                                <Label htmlFor="landmark" className="text-sm font-medium mb-1">
                                    Landmark
                                </Label>
                                <Input
                                    id="landmark"
                                    value={form.landmark ?? ""}
                                    onChange={(e) => update("landmark", e.target.value)}
                                    className="w-full"
                                    placeholder="Near Vesper School"
                                />
                            </div>

                            {/* Map Coordinates */}
                            <div>
                                <Label
                                    htmlFor="map-coordinates"
                                    className="text-sm font-medium mb-1"
                                >
                                    Map Coordinates (lat , long)
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="map-coordinates"
                                        value={form.latitude === null ? "" : (form.latitude ?? "")}
                                        onChange={(e) => update("latitude", Number(e.target.value))}
                                        className="w-1/2 text-sm"
                                        placeholder="6.45"
                                        type="number"
                                    />
                                    <Input
                                        value={
                                            form.longitude === null ? "" : (form.longitude ?? "")
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
                                    <Label htmlFor="price" className="text-sm font-medium mb-1">
                                        Price
                                    </Label>
                                    <div className="flex flex-col-reverse sm:flex-row gap-2">
                                        <Input
                                            id="price"
                                            type="number"
                                            placeholder="600,000"
                                            className={` text-sm
                                                     ${error.errorMsg.toLowerCase().includes("price") ? "border-red-600" : ""}
                                                `}
                                            value={form.price === null ? "" : (form.price ?? "")}
                                            onChange={(e) => update("price", Number(e.target.value))}
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
                                                <SelectValue placeholder="Choose Frequency" />
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
                                        id="negotiable"
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
                                        <Label
                                            htmlFor="service-charge"
                                            className="text-sm font-medium mb-1"
                                        >
                                            Service Charge
                                        </Label>
                                        <div className="flex flex-col-reverse sm:flex-row gap-2">
                                            <Input
                                                id="service-charge"
                                                value={
                                                    form.serviceCharge === null
                                                        ? ""
                                                        : (form.serviceCharge ?? "")
                                                }
                                                onChange={(e) =>
                                                    update("serviceCharge", Number(e.target.value))
                                                }
                                                className=" text-sm"
                                                placeholder="20,000"
                                                type="number"
                                            />
                                            <Select
                                                value={form.serviceChargeFrequency}
                                                onValueChange={(value) =>
                                                    update(
                                                        "serviceChargeFrequency",
                                                        value as PriceFrequency
                                                    )
                                                }
                                            >
                                                <SelectTrigger
                                                    className={`w-full sm:w-auto cursor-pointer
                                                         ${error.errorMsg.toLowerCase().includes("price frequency") ? "border-red-600" : ""}
                                                    `}
                                                >
                                                    <SelectValue placeholder="Frequency" />
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
                                    <div className="flex flex-col">
                                        <Label
                                            htmlFor="agency-fee"
                                            className="text-sm font-medium mb-1"
                                        >
                                            Agency Fee
                                        </Label>
                                        <Input
                                            id="agency-fee"
                                            value={
                                                form.agencyFee === null ? "" : (form.agencyFee ?? "")
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
                                        <Label
                                            htmlFor="legal-fee"
                                            className="text-sm font-medium mb-1"
                                        >
                                            Legal Fee
                                        </Label>
                                        <Input
                                            id="agency-fee"
                                            value={
                                                form.legalFee === null ? "" : (form.legalFee ?? "")
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
                                <Label htmlFor="bedrooms" className="text-sm font-medium mb-1">
                                    Bedrooms
                                </Label>
                                <Input
                                    id="bedrooms"
                                    type="number"
                                    value={form.bedrooms === null ? "" : (form.bedrooms ?? "")}
                                    onChange={(e) => update("bedrooms", Number(e.target.value))}
                                    className="w-full"
                                    placeholder="3"
                                    min={0}
                                />
                            </div>

                            {/* Bathrooms */}
                            <div>
                                <Label htmlFor="bathrooms" className="text-sm font-medium mb-1">
                                    Bathrooms
                                </Label>
                                <Input
                                    id="bathrooms"
                                    type="number"
                                    value={form.bathrooms === null ? "" : (form.bathrooms ?? "")}
                                    onChange={(e) => update("bathrooms", Number(e.target.value))}
                                    className="w-full"
                                    placeholder="3"
                                    min={0}
                                />
                            </div>

                            {/* Toilets */}
                            <div>
                                <Label htmlFor="toilets" className="text-sm font-medium mb-1">
                                    Toilets
                                </Label>
                                <Input
                                    id="toilets"
                                    type="number"
                                    value={form.toilets === null ? "" : (form.toilets ?? "")}
                                    onChange={(e) => update("toilets", Number(e.target.value))}
                                    className="w-full"
                                    placeholder="4"
                                    min={0}
                                />
                            </div>

                            {/* Parking Space */}
                            <div>
                                <Label
                                    htmlFor="parking-spaces"
                                    className="text-sm font-medium mb-1"
                                >
                                    Parking Spaces
                                </Label>
                                <Input
                                    id="parking-spaces"
                                    type="number"
                                    value={
                                        form.parkingSpaces === null
                                            ? ""
                                            : (form.parkingSpaces ?? "")
                                    }
                                    onChange={(e) =>
                                        update("parkingSpaces", Number(e.target.value))
                                    }
                                    className="w-full"
                                    placeholder="2"
                                    min={0}
                                />
                            </div>

                            {/* Parking Capacity */}
                            <div>
                                <Label
                                    htmlFor="parking-capacity"
                                    className="text-sm font-medium mb-1"
                                >
                                    Parking Capacity
                                </Label>
                                <Input
                                    id="parking-capacity"
                                    type="number"
                                    value={
                                        form.parkingCapacity === null
                                            ? ""
                                            : (form.parkingCapacity ?? "")
                                    }
                                    onChange={(e) =>
                                        update("parkingCapacity", Number(e.target.value))
                                    }
                                    className="w-full"
                                    placeholder="15"
                                    min={0}
                                />
                            </div>

                            {/* Furnishing */}
                            <div>
                                <Label
                                    htmlFor="furnishing"
                                    className="text-sm font-medium mb-1"
                                >
                                    Furnishing
                                </Label>
                                <Select
                                    value={form.furnishing}
                                    onValueChange={(value) =>
                                        update("furnishing", value as Furnishing)
                                    }
                                >
                                    <SelectTrigger
                                        id="furnishing"
                                        className="w-full cursor-pointer"
                                    >
                                        <SelectValue placeholder="Select furnishing" />
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
                                <Label htmlFor="condition" className="text-sm font-medium mb-1">
                                    Condition
                                </Label>
                                <Select
                                    value={form.condition}
                                    onValueChange={(value) =>
                                        update("condition", value as Condition)
                                    }
                                >
                                    <SelectTrigger
                                        id="condition"
                                        className="w-full cursor-pointer"
                                    >
                                        <SelectValue placeholder="Select condition" />
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
                                <Label htmlFor="size" className="text-sm font-medium mb-1">
                                    Size
                                </Label>
                                <div className="flex flex-col-reverse sm:flex-row gap-2">
                                    <Input
                                        id="size"
                                        type="number"
                                        value={form.size === null ? "" : (form.size ?? "")}
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
                                            <SelectValue placeholder="Unit" />
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
                                <Label
                                    htmlFor="year-built"
                                    className="text-sm font-medium mb-1"
                                >
                                    Year Built
                                </Label>
                                <Input
                                    id="year-built"
                                    type="number"
                                    value={form.yearBuilt === null ? "" : (form.yearBuilt ?? "")}
                                    onChange={(e) => update("yearBuilt", Number(e.target.value))}
                                    className="w-full"
                                    placeholder="2015"
                                />
                            </div>

                            {/* Floor Level */}
                            <div>
                                <Label
                                    htmlFor="floor-level"
                                    className="text-sm font-medium mb-1"
                                >
                                    Floor Level
                                </Label>
                                <Input
                                    id="floor-level"
                                    value={
                                        form.floorLevel === null ? "" : (form.floorLevel ?? "")
                                    }
                                    onChange={(e) => update("floorLevel", e.target.value)}
                                    className="w-full"
                                    placeholder="Ground / 1st / 2nd"
                                />
                            </div>

                            {/* Total Floors */}
                            <div>
                                <Label
                                    htmlFor="total-floor"
                                    className="text-sm font-medium mb-1"
                                >
                                    Total Floors
                                </Label>
                                <Input
                                    id="total-floor"
                                    type="number"
                                    value={
                                        form.totalFloors === null ? "" : (form.totalFloors ?? "")
                                    }
                                    onChange={(e) =>
                                        update("totalFloors", Number(e.target.value))
                                    }
                                    className="w-full"
                                    placeholder="3"
                                />
                            </div>

                            {/* Floor Area */}
                            <div>
                                <Label
                                    htmlFor="floor-area"
                                    className="text-sm font-medium mb-1"
                                >
                                    Floor Area
                                </Label>
                                <Input
                                    id="floor-area"
                                    type="number"
                                    value={form.floorArea === null ? "" : (form.floorArea ?? "")}
                                    onChange={(e) => update("floorArea", Number(e.target.value))}
                                    className="w-full"
                                    placeholder="2000"
                                />
                            </div>

                            {/* Amenities  */}
                            <div className="md:col-span-3">
                                <Label htmlFor="amenities" className="text-sm font-medium mb-1">
                                    Amenities
                                </Label>
                                <div
                                    id="amenities"
                                    className="grid grid-cols-2 md:grid-cols-4 gap-2"
                                >
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
                                <Label
                                    htmlFor="display-imagge"
                                    className="text-sm font-medium mb-1"
                                >
                                    Display Images
                                </Label>
                                <ScrollArea>
                                    <div id="display-imagge" className="flex gap-2">
                                        {form.images?.length
                                            ? form.images.map((src, idx) => (
                                                <DisplayImage
                                                    key={idx}
                                                    className="w-36 h-28 flex-shrink-0 rounded-xl"
                                                    src={src}
                                                    alt={src}
                                                    remove={(rsrc) => {
                                                        update(
                                                            "images",
                                                            form.images.filter((furl) => furl !== rsrc)
                                                        );
                                                    }}
                                                />
                                            ))
                                            : null}
                                        <GalleryModal
                                            setGetSelected={(img) =>
                                                update("images", [
                                                    ...form.images,
                                                    ...img.map((img) => img.url),
                                                ])
                                            }
                                        />
                                    </div>
                                    <ScrollBar orientation="horizontal" />
                                </ScrollArea>
                            </div>

                            {/* Video / Virtual Tour Link */}
                            <div>
                                <Label htmlFor="vidoe-url" className="text-sm font-medium mb-1">
                                    Video / Virtual Tour Link (optional)
                                </Label>
                                <Input
                                    id="vidoe-url"
                                    value={form.videoUrl ?? ""}
                                    onChange={(e) => update("videoUrl", e.target.value)}
                                    placeholder="YouTube link or 360 tour URL"
                                    className="w-full"
                                />
                                <p className="block text-xs text-gray-500 text-center text-wrap mt-1">
                                    Please upload your property video to{" "}
                                    <span className="text-red-500 font-medium">YouTube</span> and
                                    share the link here.
                                </p>
                            </div>

                            {/* Agent / Owner details */}
                            <div>
                                <Label
                                    htmlFor="agent"
                                    className="text-sm font-medium mb-1 mt-4"
                                >
                                    Agent / Owner
                                </Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        id="agent"
                                        value={form.agentName}
                                        onChange={(e) => update("agentName", e.target.value)}
                                        className="w-full"
                                        placeholder="Agent name"
                                        readOnly
                                    />

                                    {/* Phone number */}
                                    <Input
                                        type="tel"
                                        placeholder="Phone number"
                                        className="border-0 rounded-none flex-1 focus-visible:ring-0"
                                        value={
                                            form.agentPhone === null ? "" : (form.agentPhone ?? "")
                                        }
                                        onChange={(e) => {
                                            if (isNaN(Number(e.target.value))) return;
                                            update("agentPhone", e.target.value);
                                        }}
                                        readOnly
                                    />
                                    <Input
                                        type="email"
                                        value={form.agentEmail}
                                        onChange={(e) => update("agentEmail", e.target.value)}
                                        className="w-full"
                                        placeholder="Email"
                                        readOnly
                                    />
                                    <Input
                                        value={form.agentCompany}
                                        onChange={(e) => update("agentCompany", e.target.value)}
                                        className="w-full"
                                        placeholder="Company name"
                                        readOnly
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
                                <Label htmlFor="meta" className="text-base font-medium mt-1">
                                    Meta / Listing Management
                                </Label>

                                <div
                                    id="meta"
                                    className="space-y-4 md:grid md:grid-col-2 md:gap-4 mt-4"
                                >
                                    {/* SEO Slug */}
                                    <div className="flex-1 flex flex-col col-span-2">
                                        <Label
                                            htmlFor="seo-slug"
                                            className="text-sm font-medium mb-1"
                                        >
                                            SEO Slug
                                        </Label>
                                        <Input
                                            id="seo-slug"
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
                                            htmlFor="reference-id"
                                            className="text-sm font-medium mb-1"
                                        >
                                            Reference ID
                                        </Label>
                                        <Input
                                            id="reference-id"
                                            placeholder="AGB-20250922-001"
                                            value={form.referenceId}
                                            onChange={(e) => update("referenceId", e.target.value)}
                                            readOnly
                                            className=" text-sm"
                                        />
                                    </div>

                                    {/* Listing Availibility */}
                                    {/* <div className="flex flex-col">
                                        <Label
                                            htmlFor="availibility"
                                            className="text-sm font-medium mb-1"
                                        >
                                            Availability
                                        </Label>
                                        <Select
                                            value={form.availability}
                                            onValueChange={(value) =>
                                                update("availability", value as Availability)
                                            }
                                        >
                                            <SelectTrigger
                                                id="availibility"
                                                className="w-full cursor-pointer"
                                            >
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {AVAILABILITY.map((av) => (
                                                    <SelectItem
                                                        className="cursor-pointer text-sm"
                                                        value={av.value}
                                                        key={av.name}
                                                    >
                                                        {av.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div> */}

                                    {/* Package Type */}
                                    <div className="flex flex-col">
                                        <Label
                                            htmlFor="package-type"
                                            className="text-sm font-medium mb-1"
                                        >
                                            Package Type
                                        </Label>
                                        <Select
                                            value={form.packageType}
                                            onValueChange={(value) =>
                                                update("packageType", value as PackageType)
                                            }
                                        >
                                            <SelectTrigger
                                                id="package-type"
                                                className="w-full cursor-pointer"
                                            >
                                                <SelectValue placeholder="Select package type" />
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
                                            htmlFor="priority-rank"
                                            className="text-sm font-medium mb-1"
                                        >
                                            Priority Rank
                                        </Label>
                                        <Input
                                            id="priority-rank"
                                            type="number"
                                            min={1}
                                            max={10}
                                            placeholder="1-10"
                                            value={
                                                form.priorityRank === null
                                                    ? ""
                                                    : (form.priorityRank ?? "")
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
                                    <div className="col-span-2 w-full">
                                        <Label htmlFor="date" className="text-sm font-medium mb-1">
                                            Date Listed
                                        </Label>
                                        <CustomCalendar
                                            id="date"
                                            date={form.createdAt}
                                            setDate={(date) => update("createdAt", date!)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FormSection>
                )}

                {/* Preview & Confirm */}
                {step === 5 && (
                    <Property
                        property={form}
                        viewer={accountType}
                        placeViewing="PREVIEW"
                    />
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
                            <ArrowLeftIcon className="h-5 w-5" /> Back
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
                {step === 5 && (
                    <div className="sticky bottom-4 left-0 right-0">
                        <div className="w-full h-full flex justify-center px-4">
                            <FormButton
                                loading={loading}
                                isDocEdited={isDocEdited}
                                documentType={documentType}
                                accountType={accountType}
                                title={form.title}                                
                            />
                        </div>
                    </div>
                )}
            </form>

            {/* Unsaved Changes Alert */}
            <AlertDialog
                open={openPrompt}
                onOpenChange={setOpenPrompt}
            >
                    <AlertDialogContent className="sm:max-w-md rounded-2xl">
                        <div className="flex justify-between items-start">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Unsaved changes</AlertDialogTitle>
                                <AlertDialogDescription>
                                    You have unsaved data. Save it as a draft before leaving?
                                </AlertDialogDescription>
                            </AlertDialogHeader>

                            <button
                                onClick={() => setOpenPrompt(false)}
                                className="p-1 rounded hover:bg-gray-100"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        <AlertDialogFooter className="mt-6 gap-2 sm:justify-end">
                            <AlertDialogAction
                                onClick={saveDraftAndLeave}
                                className="bg-blue-600"
                            >
                                Save Draft & Leave
                            </AlertDialogAction>
                            <AlertDialogAction
                                onClick={() => {
                                    setForm(() => DEFAULT_PROPERTY_FORM);
                                    leaveWithoutSaving();
                                }}
                                className="bg-red-600"
                            >
                                Leave Without Saving
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
            </AlertDialog>

            {/* Dialog for pending account */}
            <PendingApprovalDialog
                open={pendingAgentDialogOpen}
                onClose={() => setpendingAgentDialogOpen(false)}
                onSaveDraft={handleSaveDraft}
            />    

            <OverlayLoader loading={loading} />
        </div >
    );
}

function FormSection({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <section className="w-full h-auto">
            <Card className="shadow-sm py-6 px-4 md:px-6 rounded-sm text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900">
                <h2 className="text-lg text-wrap font-semibold uppercase">{title}</h2>
                <>{children}</>
            </Card>
        </section>
    );
};

