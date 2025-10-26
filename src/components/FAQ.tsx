
"use client";

import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import FQAs from "@/data/FAQ";


export default function FAQ({ full }: { full: boolean }) {
    return <Accordion type="single" collapsible className="space-y-4">
        {
            FQAs.map((faq, idx) => {
                if (!full && idx > 5) {
                    return null;
                }

                return <AccordionItem key={faq.id} value={"item-" + faq.id} className="border rounded-lg bg-white shadow-sm">
                    <AccordionTrigger className="px-4 py-3">
                        <h4 className="text-base md:text-lg font-semibold">{faq.q}</h4>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                        <p className="text-sm md:text-base text-gray-700">
                            {faq.a}
                        </p>
                    </AccordionContent>
                </AccordionItem>
            })
        }

    </Accordion>;
}

