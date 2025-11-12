
import ContactForm from "@/components/ContactForm";
import FAQ from "@/components/FAQ";
import SocialMedia from "@/components/SocialMedia";
import { Clock3, Headset, Mail, MapPinHouse, PhoneCall } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import Script from "next/script";
import ClientContact from "./ClientContact";

export const metadata: Metadata = {
    title: "Contact Us | Agbara Badagry Property Center",
    description:
        "Get in touch with Agbara Badagry Property Center. Reach out to our agents for property inquiries, sales, rentals, or support.",
    openGraph: {
        title: "Contact Agbara Badagry Property Center",
        description:
            "Reach out to our agents for property inquiries, sales, rentals, or support in Agbara, Badagry, and surrounding areas.",
        url: "https://agbarabadagrypropertycenter.com/contact",
    },
};

export default function Contact() {


    const schema = {
        "@context": "https://schema.org",
        "@type": "RealEstateAgent",
        name: "Agbara Badagry Property Center",
        url: "https://agbarabadagrypropertycenter.com",
        logo: "https://agbarabadagrypropertycenter.com/logo.png",
        image: "https://agbarabadagrypropertycenter.com/og-image.png",
        description:
            "Reach out to Agbara Badagry Property Center for property inquiries, rentals, sales, or support.",
        areaServed: ["Agbara", "Badagry", "Lusada", "Atan", "Ibereko"],
        telephone: "+2348012345678",
        contactType: "Customer Support",
    };

    return <div>

        {/* Hero */}
        <section className="py-10 md:py-20 bg-primary text-white md:rounded-sm">
            <div className="mx-auto px-6 text-center">
                <div className="flex justify-center mb-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-2 text-sm">
                        <Headset size={20} />
                        <span className="text-sm">24/7 Customer Support</span>
                    </div>
                </div>
                <h1 className="text-2xl font-semibold mb-4">Get in Touch With Our Expert Team</h1>
                <p className="max-w-3xl mx-auto text-base">Our experienced professionals are here to guide you through every step of your real estate journey in Agbara Badagary.</p>
            </div>
        </section>

        {/* Contact location */}
        <section className="py-10 md:py-20">
            <div className="mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
                        <h1 className="text-2xl font-bold mb-8 text-primary">Contact Information</h1>
                        <div className="space-y-8">
                            <div className="flex items-start space-x-4">
                                <div className="bg-red-50 dark:bg-gray-700 p-3 rounded-lg flex-shrink-0">
                                    <MapPinHouse size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-base text-gray-900 dark:text-white">Office Address</h3>
                                    <p className="text-gray-600 text-sm">Mango bus stop Agbara-Lusada Road <br />Ogun State, Nigeria</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="bg-red-50 dark:bg-gray-700 p-3 rounded-lg flex-shrink-0">
                                    <PhoneCall size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-base text-gray-900 dark:text-white">Phone Numbers</h3>                                    
                                    <p className="text-gray-600 text-sm">+234 707 235 4095</p>
                                    <p className="text-gray-600 text-sm">+234 805 052 4419</p>
                                    <p className="text-gray-600 text-sm">+234 812 307 0785</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="bg-red-50 dark:bg-gray-700 p-3 rounded-lg flex-shrink-0">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-base text-gray-900 dark:text-white">Email Address</h3>
                                    <p className="text-gray-600 text-sm">info@agbarabadagarypropertycenter.com</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="bg-red-50 dark:bg-gray-700 p-3 rounded-lg flex-shrink-0">
                                    <Clock3 size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-base text-gray-900 dark:text-white">Office Hours</h3>
                                    <p className="text-gray-600 text-sm">Monday - Friday: 9:00 AM - 6:00 PM</p>
                                    <p className="text-gray-600 text-sm">Saturday: 10:00 AM - 4:00 PM</p>
                                    <p className="text-gray-600 text-sm">Sunday: Closed</p>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6">
                            <h3 className="font-semibold text-base text-gray-900 dark:text-white mb-4">Follow Us</h3>
                            <div className="flex items-center space-x-4">
                                <SocialMedia />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-xl shadow-md flex min-h-[420px]">
                       <ClientContact />
                    </div>
                </div>
            </div>
        </section>

        {/* FAQs */}
        <section className="py-10 md:py-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-4xl font-bold text-primary">Frequently Asked Questions</h2>
                    <p className="text-gray-600 text-sm mt-2">Quick answers to common questions about our services.</p>
                </div>                
                <div>
                    <FAQ full={false} />                    
                    <div className="flex justify-end items-center mt-4">
                        <Link href="/faq" className="text-base text-primary font-medium">See All FAQ</Link>
                    </div>
                </div>
            </div>
        </section>

        {/* Contact form */}
        <section className="py-10 md:py-20">
            <div className="mx-auto px-2 md:px-6 max-w-4xl">
                <div className="bg-white px-4 py-10 md:p-12 rounded-xl shadow-md">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-4xl font-bold text-primary">Send Us a Message</h2>
                        <p className="text-gray-600 text-sm mt-2">{"Fill out the form below and we'll get back to you within 24 hours."}</p>
                    </div>
                    <ContactForm />                   
                </div>
            </div>
        </section>
        
        <Script
            id="contact-jsonld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    </div>

}