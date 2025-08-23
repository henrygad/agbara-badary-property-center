// src/app/blog/page.tsx
import { BlogPost } from "@/types/blogpost.types";
import Image from "next/image";
import Link from "next/link";

const posts: BlogPost[] = [
  {
    id: "1",
    title: "The Ultimate Guide to Buying Your First Home",
    description:
      "Everything you need to know to purchase successfully, from saving for a down payment to closing the deal.",
    image: "/images/house1.jpg",
    likes: 192,
    comments: 35,
  },
  {
    id: "2",
    title: "Top 5 Neighborhoods for Young Professionals",
    description:
      "Discover vibrant communities perfect for career-driven individuals, offering vibrant social scenes and convenience.",
    image: "/images/house2.png",
    likes: 78,
    comments: 20,
  },
  {
    id: "3",
    title: "Investing in Real Estate: A Beginner’s Guide",
    description:
      "Learn the basics of real estate investment, from understanding market strategies to maximizing returns.",
    image: "/images/house3.png",
    likes: 160,
    comments: 44,
  },
  {
    id: "4",
    title: "The Future of Home Design: Trends to Watch",
    description:
      "Explore the latest innovations in home architecture and interior design. The future of residential living awaits.",
    image: "/images/house4.png",
    likes: 98,
    comments: 28,
  },
  {
    id: "5",
    title: "Navigating the Mortgage Process: Tips and Tricks",
    description:
      "Break down the complexities of mortgage approval, interest rates, and repayment options.",
    image: "/images/house5.png",
    likes: 120,
    comments: 32,
  },
];

export default function BlogPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-8">Latest from UrbanNest</h1>

      <div className="space-y-8">
        {
          posts?.length ?
          posts.map((post) => (
            <div
              key={post.id}
              className="flex flex-col md:flex-row gap-6 border-b pb-6"
            >
              {/* Post Content */}
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{post.title}</h2>
                <p className="text-gray-600 mt-2">{post.description}</p>
                <div className="flex items-center gap-6 mt-4">
                  <Link
                    href={`/blog/${post.id}`}
                    className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-100"
                  >
                    Read More
                  </Link>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments}</span>
                  </div>
                </div>
              </div>

              {/* Post Image */}
              <div className="w-full md:w-48 h-32 relative rounded-lg overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )) :
            <div>No posts found</div>
        }
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-10 space-x-3 text-gray-600">
        <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
          1
        </button>
        <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
          2
        </button>
        <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
          3
        </button>
        <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
          &gt;
        </button>
      </div>
    </main>
  );
}
