"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// ✅ Schema with Zod
const propertySchema = z.object({

    // Basic
    title: z.string().min(3, "Title is required"),
    description: z.string().min(10, "Description required"),
    price: z.number().min(1),
    serviceCharge: z.number().optional(),
    agencyFee: z.number().optional(),
    legalFee: z.number().optional(),

    // Location
    state: z.string(),
    city: z.string(),
    area: z.string().optional(),
    address: z.string(),
    latitude: z.string().optional(),
    longitude: z.string().optional(),

    // Property details
    propertyType: z.string(),
    bedrooms: z.number().optional(),
    bathrooms: z.number().optional(),
    toilets: z.number().optional(),
    parking: z.number().optional(),
    size: z.number().optional(),
    yearBuilt: z.number().optional(),
    condition: z.string().optional(),
    furnishing: z.string().optional(),

    // Amenities
    amenities: z.array(z.string()).optional(),

    // Meta
    refId: z.string(),
    slug: z.string(),
    listingStatus: z.enum(["Draft", "Pending", "Published", "Archived"]),
    packageType: z.enum(["Free", "Premium", "Featured"]),
    priority: z.number().min(1).max(10).optional(),
    verificationStatus: z.enum(["Verified", "Unverified"]),
    dateListed: z.string(),
    lastUpdated: z.string(),
    expiryDate: z.string().optional(),

});

type PropertyFormValues = z.infer<typeof propertySchema>;

export default function PropertyForm() {

    const form = useForm<PropertyFormValues>({
        resolver: zodResolver(propertySchema),
        
        defaultValues: {
            title: "",
            description: "",
            price: 0,
            state: "",
            city: "",
            address: "",
            propertyType: "Flat",
            refId: "AGB-" + Date.now(),
            slug: "",
            listingStatus: "Draft",
            packageType: "Free",
            verificationStatus: "Unverified",
            dateListed: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
        },

    });

    function onSubmit(values: PropertyFormValues) {
        console.log("✅ Submitted Values:", values);
    }

    return (
        <Card className="p-6 space-y-8 w-[980px]">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    {/* 🔹 Basic Info */}
                    <div>
                        <h2 className="font-semibold text-lg mb-2">Basic Information</h2>
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Property Title</FormLabel>
                                <FormControl><Input placeholder="Beautiful 3-Bedroom Flat in Agbara" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl><Textarea placeholder="Write a detailed description..." {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className="grid grid-cols-3 gap-4">
                            <FormField control={form.control} name="price" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price (₦)</FormLabel>
                                    <FormControl><Input type="number" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="serviceCharge" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Service Charge</FormLabel>
                                    <FormControl><Input type="number" {...field} /></FormControl>
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="agencyFee" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Agency Fee</FormLabel>
                                    <FormControl><Input type="number" {...field} /></FormControl>
                                </FormItem>
                            )} />
                        </div>
                    </div>

                    {/* 🔹 Location */}
                    <div>
                        <h2 className="font-semibold text-lg mb-2">Location</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="state" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl><Input placeholder="Lagos" {...field} /></FormControl>
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="city" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl><Input placeholder="Agbara" {...field} /></FormControl>
                                </FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="address" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl><Input placeholder="Street name and number" {...field} /></FormControl>
                            </FormItem>
                        )} />
                    </div>

                    {/* 🔹 Property Details */}
                    <div>
                        <h2 className="font-semibold text-lg mb-2">Property Details</h2>
                        <FormField control={form.control} name="propertyType" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Property Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="Flat">Flat</SelectItem>
                                        <SelectItem value="Duplex">Duplex</SelectItem>
                                        <SelectItem value="Land">Land</SelectItem>
                                        <SelectItem value="Commercial">Commercial</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )} />
                    </div>

                    {/* 🔹 Amenities */}
                    <div>
                        <h2 className="font-semibold text-lg mb-2">Amenities</h2>
                        <div className="grid grid-cols-2 gap-2">
                            {["Water Heater", "Parking Space", "Security", "Balcony"].map((item) => (
                                <FormField key={item} control={form.control} name="amenities" render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-2">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value?.includes(item)}
                                                onCheckedChange={(checked) => {
                                                    return checked
                                                        ? field.onChange([...(field.value || []), item])
                                                        : field.onChange(field.value?.filter((v) => v !== item));
                                                }}
                                            />
                                        </FormControl>
                                        <FormLabel className="text-sm">{item}</FormLabel>
                                    </FormItem>
                                )} />
                            ))}
                        </div>
                    </div>

                    {/* 🔹 Meta / Listing Management */}
                    <div>
                        <h2 className="font-semibold text-lg mb-2">Meta / Listing Management</h2>
                        <FormField control={form.control} name="refId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Reference ID</FormLabel>
                                <FormControl><Input readOnly {...field} /></FormControl>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="slug" render={({ field }) => (
                            <FormItem>
                                <FormLabel>SEO Slug</FormLabel>
                                <FormControl><Input placeholder="3-bedroom-flat-agbara" {...field} /></FormControl>
                            </FormItem>
                        )} />
                    </div>

                    <Button type="submit" className="w-full">Save Listing</Button>
                </form>
            </Form>
        </Card>
    );
}
