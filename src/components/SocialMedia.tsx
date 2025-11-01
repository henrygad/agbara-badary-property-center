
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function SocialMedia() {
    return <>
        <Link
            className="text-white hover:text-gray-300 p-2 rounded-md bg-red-500/50 shadow"
            href="https://www.facebook.com"  
            target='_blank'
        >
            <Facebook size={15} />
        </Link>
        <Link
            className="text-white hover:text-gray-300 p-2 rounded-md bg-red-500/50 shadow"
            href="https://www.x.com"
            target='_blank'
        >
            <Twitter size={15} />
        </Link>
        <Link
            className="text-white hover:text-gray-300 p-2 rounded-md bg-red-500/50 shadow"
            href="https://www.linkedin.com"
            target='_blank'
        >
            <Linkedin size={15} />
        </Link>
        <Link
            className="text-white hover:text-gray-300 p-2 rounded-md bg-red-500/50 shadow"
            href="https://www.instagram.com"
            target='_blank'
        >
            <Instagram size={15} />
        </Link>
    </>
}
