import FAQ from "@/components/FAQ";
import FQAs from "@/data/FAQ";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "FAQ | Agbara Badagry Property Center",
  description:
    "Frequently Asked Questions about buying, selling, and renting properties along Agbara–Badagry expressway. Get answers about listings, agents, and your account.",
  openGraph: {
    title: "FAQ | Agbara Badagry Property Center",
    description:
      "Find answers to common questions about buying, selling, and renting properties along Agbara–Badagry expressway.",
    url: "https://agbarabadagrypropertycenter.com/faq",
  },
};


export default function FrequestlyAskQuestions() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FQAs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <div className="w-full p-2">
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-2xl md:text-4xl font-bold text-primary">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-600 text-sm mt-2">
              Quick answers to common questions about our services.
            </p>
          </div>
          <div>
            <FAQ full={true} />
          </div>
        </div>
      </section>
      <Script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </div>
  );
}
