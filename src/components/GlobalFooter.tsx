import React from 'react'
import CompanyLogo from './CompanyLogo'
import Link from 'next/link'

export default function GlobalFooter() {

    return <footer className="bg-primary text-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className='flex flex-col items-start gap-2'>
                    <CompanyLogo location='Footer'/>
                    <p className="text-sm text-wrap mb-4">
                        Your trusted partner in real estate, offering premium services for properties in Agbara-Badagry... <Link href="/about" className='px-2 border rounded-sm font-medium text-white hover:text-foreground'>More</Link>
                    </p>

                    <div className="flex space-x-4">
                        <Link className="text-white hover:text-gray-300" href="#">
                            facebook
                        </Link>
                        <Link className="text-white hover:text-gray-300" href="#">
                            twiter
                        </Link>
                        <Link className="text-white hover:text-gray-300" href="#">
                            linkenin
                        </Link>
                        <Link className="text-white hover:text-gray-300" href="#">
                            instagram
                        </Link>
                    </div>
                </div>
                <div>
                    <h4 className="font-bold mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link className="hover:text-gray-300" href="#">Properties for sale</Link></li>
                        <li><Link className="hover:text-gray-300" href="#">Properties for rent</Link></li>
                        <li><Link className="hover:text-gray-300" href="#">About US</Link></li>
                        <li><Link className="hover:text-gray-300" href="#">Contact Agents</Link></li>
                        <li><Link className="hover:text-gray-300" href="#">Blog/Agents</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-4">Services</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link className="hover:text-gray-300" href="#">Property Valuation</Link></li>
                        <li><Link className="hover:text-gray-300" href="#">Property Management</Link></li>
                        <li><Link className="hover:text-gray-300" href="#">Legal Support</Link></li>
                        <li><Link className="hover:text-gray-300" href="#">Real Estate Advisory</Link></li>
                        <li><Link className="hover:text-gray-300" href="#">Mortgage Services</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-4">Legal</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link className="hover:text-gray-300" href="#">Terms of Service</Link></li>
                        <li><Link className="hover:text-gray-300" href="#">Privacy Policy</Link></li>
                        <li><Link className="hover:text-gray-300" href="#">Cookie Policy</Link></li>
                        <li><Link className="hover:text-gray-300" href="#">Disclaimer</Link></li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-primary mt-8 pt-6 text-center text-sm">
                <p>© 2025 Agbara Badagary Property Center. All rights reserved.</p>
            </div>
        </div>
    </footer>
}
