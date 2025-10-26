
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function SocialMedia() {
    return <>
        <Link
            className="text-white hover:text-gray-300 p-2 rounded-md bg-red-500/50 shadow"
            href="facebook.com"
        >
            <Facebook size={15} />
        </Link>
        <Link
            className="text-white hover:text-gray-300 p-2 rounded-md bg-red-500/50 shadow"
            href="x.com"
        >
            <Twitter size={15} />
        </Link>
        <Link
            className="text-white hover:text-gray-300 p-2 rounded-md bg-red-500/50 shadow"
            href="linkedin.com"
        >
            <Linkedin size={15} />
        </Link>
        <Link
            className="text-white hover:text-gray-300 p-2 rounded-md bg-red-500/50 shadow"
            href="instagram.com"
        >
            <Instagram size={15} />
        </Link>
    </>
}
