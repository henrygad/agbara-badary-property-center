// src/app/blog/page.tsx
import Blogpost from "@/components/Blogpost";
import { BlogPost } from "@/types/blogpost.types";

const posts: BlogPost[] = [
  {
    id: "1",
    title: "The Ultimate Guide to Buying Your First Home",
    description:
      "Buying your first home is a significant milestone. This guide provides a step-by-step approach to navigate the process successfully, from saving for a down payment to closing the deal.",
    image: "/images/house1.png",
    likes: 192,
    comments: 35,
  },
  {
    id: "2",
    title: "Top 5 Neighborhoods for Young Professionals",
    description:
      "Discover the best neighborhoods for young professionals, offering vibrant social scenes, convenient amenities, and promising career opportunities.",
    image: "/images/house2.png",
    likes: 78,
    comments: 20,
  },
  {
    id: "3",
    title: "Investing in Real Estate: A Beginner’s Guide",
    description:
     "Learn the basics of real estate investing, including different investment strategies, risk management, and how to get started with your first property.",
    image: "/images/house3.png",
    likes: 160,
    comments: 42,
  },
  {
    id: "4",
    title: "Navigating the Mortgage Process: Tips and Tricks",
    description:
      "Demystify the mortgage process with expert advice on securing the best rates, understanding loan options, and avoiding common pitfalls.",
    image: "/images/house4.png",
    likes: 84,
    comments: 19,
  },
  {
    id: "5",
    title: "The Future of Home Design: Trends to Watch",
    description:
      "Explore the latest trends in home design, from sustainable materials to smart home technology, and how these innovations are shaping the future of residential living.",
    image: "/images/house5.png",
    likes: 105,
    comments: 25,
  },
];

export default function BlogListPage() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12 bg-white min-h-screen">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-8">Latest from UrbanNest</h1>

      {/* Blog List */}
      <div className="space-y-8">
        {posts.map((post) => (
          <Blogpost
            key={post.id}
            id={post.id}
            title={post.title}
            description={post.description}
            image={post.image}
            likes={post.likes}
            comments={post.comments}
            isShort={true}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-10">
        <button className="px-3 py-1 rounded bg-gray-100 text-gray-600">
          1
        </button>
        <button className="px-3 py-1 rounded hover:bg-gray-100">2</button>
        <button className="px-3 py-1 rounded hover:bg-gray-100">3</button>
        <span className="px-2">...</span>
        <button className="px-3 py-1 rounded hover:bg-gray-100">6</button>
      </div>
    </section>
  );
}
