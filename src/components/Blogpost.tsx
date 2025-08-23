import { BlogPost } from '@/types/blogpost.types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

interface Props extends BlogPost {
    isShort: boolean;
}

const Blogpost = ({ id, title, description, image, likes, comments, isShort }: Props) => {

    return <div        
        className="flex flex-col md:flex-row gap-6 border-b pb-6"
    >
        {/* Post Content */}
        <div className="flex-1">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-gray-600 mt-2">{description}</p>
            <div className="flex items-center gap-6 mt-4">
                <Link
                    href={`/blog/${id}`}
                    className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-100"
                >
                    Read More
                </Link>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <button>❤️ {likes}</button>
                    <button>💬 {comments}</button>
                </div>
            </div>
        </div>

        {/* Post Image */}
        <div className="w-full md:w-48 h-32 relative rounded-lg overflow-hidden">
            <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
            />
        </div>
    </div>;
}

export default Blogpost