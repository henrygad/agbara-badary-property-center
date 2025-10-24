
import React from 'react'
import Link from 'next/link'
import { Headset } from "lucide-react";
import CompanyLogo from './CompanyLogo';

export default function GlobalHeader() {
    return <header className="px-2 sm:px-8 flex justify-between items-center border-b border-gray-200 bg-white">
        <div className="flex items-center justify-start">
            <CompanyLogo location='Header' />
        </div>
        <nav className="hidden md:flex items-center space-x-6 text-base font-medium">        
            <Link className="hover:text-primary" href="#">Buy</Link>
            <Link className="hover:text-primary" href="#">Rent</Link>
            <Link className="hover:text-primary" href="#">Short-let</Link>                       
        </nav>
        <div className="flex gap-4 items-center text-sm md:text-base font-medium pr-2">            
            <Link className="hidden md:flex hover:text-primary" href="#">
                Login
            </Link>
            <Link className="hidden md:flex bg-primary text-white px-4 py-2 rounded-md shadow hover:bg-red-600" href="#">
                Register
            </Link>
            <Link className="md:hidden flex bg-primary text-white px-4 py-1.5 rounded-md shadow hover:bg-red-600" href="#">
               Login
            </Link>
            <Link href="#" className="flex items-center space-x-1 hover:text-primary">
                <Headset size={20} className="text-green-900" />                
            </Link>        
        </div>
    </header>
};
