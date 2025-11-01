import React from 'react'
import CompanyLogo from './CompanyLogo'
import Link from 'next/link'
import SocialMedia from './SocialMedia';
import { Button } from './ui/button';
import { ChevronsRight } from 'lucide-react';

export default function GlobalFooter() {

    return <footer className="bg-primary text-white">

        {/* Call to action */}
        <section className="border-b">
            <div className="mx-auto px-4 py-14 md:py-20 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-2">Looking for Your Dream Property?</h2>
                <p className="text-base max-w-2xl mx-auto text-gray-200 mb-4">Browse thousands of verified listings in Agbara Badagary and surrounding areas.</p>
                <Button
                    variant="ghost"
                    className='text-base ring-1 hover:text-primary cursor-pointer'
                >
                    <Link href="/properties" className='flex gap-1 items-center text-nowrap whitespace-pre'> Find Properties <ChevronsRight size={10} /></Link>
                </Button>
            </div>
        </section>

        {/* Important links */}
        <section className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                    <div>
                        <CompanyLogo location='Footer' />
                        <div>
                            <p className="text-sm text-wrap">Your trusted partner in real estate, offering premium services for properties in Agbara-Badagry...</p>
                            <button className='px-2 py-2 border rounded-sm mt-2'>
                                <Link href="/about">
                                    <p className='text-xs font-medium  hover:text-foreground'>Read More</p>
                                </Link>
                            </button>
                        </div>   
                    </div>                 
                </div>
                <div className='flex md:justify-center'>
                    <div>
                        <h4 className="font-bold mb-4 text-sm">Quick Links</h4>
                        <ul className="space-y-2 text-xs">                        
                        <li><Link className="block hover:text-gray-300" href={{ pathname: "/properties", query: { tab: "Sale" } }}>Properties for Buy</Link></li>
                        <li><Link className="block hover:text-gray-300" href={{ pathname: "/properties", query: { tab: "Rent" } }}>Properties for Rent</Link></li>
                        <li><Link className="block hover:text-gray-300" href={{ pathname: "/properties", query: { tab: "Short-let" } }}>Properties for Short-let</Link></li>
                        <li><Link className="block hover:text-gray-300" href={{ pathname: "/properties", query: { tab: "Commercial" } }}>Properties for Commercial</Link></li>
                        <li><Link className="block hover:text-gray-300" href="/about">About US</Link></li>
                        <li><Link className="block hover:text-gray-300" href="/contact">Contact Agents</Link></li>
                        <li><Link className="block hover:text-gray-300" href="/faq">FAQ</Link></li>
                        <li><Link className="block hover:text-gray-300" href="/blog">Blog</Link></li>
                    </ul>
                    </div>
                </div>
                <div className='flex md:justify-center'>
                    <div>
                        <h4 className="font-bold mb-4 text-base">Services</h4>
                        <ul className="space-y-2 text-xs">
                        <li><Link className="hover:text-gray-300" href="#">Property Valuation</Link></li>
                        <li><Link className="hover:text-gray-300" href="#">Property Management</Link></li>
                        <li><Link className="hover:text-gray-300" href="#">Legal Support</Link></li>
                        <li><Link className="hover:text-gray-300" href="#">Real Estate Advisory</Link></li>
                        <li><Link className="hover:text-gray-300" href="#">Mortgage Services</Link></li>
                        </ul>
                    </div>
                </div>
                
                <div className='flex md:justify-center'>
                    <div>
                        <h4 className="font-bold mb-4 text-base">Legal</h4>
                        <ul className="space-y-2 text-xs">
                            <li><Link className="hover:text-gray-300" href="/terms">Terms and Conditions</Link></li>
                        <li><Link className="hover:text-gray-300" href="/privacy-policy">Privacy Policy</Link></li>
                        <li><Link className="hover:text-gray-300" href="/cookies">Cookie Policy</Link></li>
                        <li><Link className="hover:text-gray-300" href="/disclaimer">Disclaimer</Link></li>
                        </ul>
                    </div>
                </div>
                <div className='flex md:justify-center'>
                    <div>
                        <h4 className="font-bold mb-4 text-base">Follow Us</h4>
                        <div className="flex space-x-4">
                            <SocialMedia />
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-t mt-8 pt-4 text-start text-xs">
                <p className='text-xs'>© 2025 Agbara Badagary Property Center. All rights reserved.</p>
            </div>
        </section>
    </footer>
}
