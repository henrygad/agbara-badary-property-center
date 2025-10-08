"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PropertyTypes } from "@/types/property.types";
import { CardMenu } from "./CardMenu";

export default function PropertyCard(p: PropertyTypes) {
    const { title, referenceId, description, category, type, status, price } = p;

    const truncateWords = (text: string, limit: number) => {
        const words = text.split(" ");
        return words.length > limit ? words.slice(0, limit).join(" ") + "..." : text;
    };

    return <Card className="flex-1  flex flex-col basis-1">
        {/* Title */}
        <CardHeader>
            <span className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">{title}</h3>
                <CardMenu property={p} />
            </span>
            <span className="flex justify-start gap-2">
                <Badge variant="secondary" >{category}</Badge>
                <span className="font-medium">₦{price?.toLocaleString()}</span>
            </span>
        </CardHeader>

        {/* Short Description */}
        <CardContent>
            <p className="text-sm text-muted-foreground">
                {truncateWords(description || "No description found for this property", 30)}
            </p>
        </CardContent>

        {/* Footer Info */}
        <CardFooter className="flex justify-between items-center gap-3 mt-2">
            <span className="flex items-center gap-1">                
                <p className="text-xs font-medium text-muted-foreground">{referenceId}</p>
            </span>
            <span className="flex-1 flex gap-3 justify-end text-sm">
                <Badge variant="outline" >{type}</Badge>
                <Badge
                    variant={status === "For Sale" || status === "For Rent" ? "default" : "destructive"}
                >
                    {status}
                </Badge>
            </span>
        </CardFooter>
    </Card>

};