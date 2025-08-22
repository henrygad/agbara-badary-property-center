// src/app/blog/page.tsx
import Image from "next/image";

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  likes: number;
  comments: number;
};

const posts: BlogPost[] = [
  {
    id: "1",
    title: "The Ultimate Guide to Buying Your First Home",
    excerpt:
      "Buying your first home is a significant milestone. This guide provides a step-by-step approach to navigate the process successfully, from saving for a down payment to closing the deal.",
    image: "/images/house1.png",
    likes: 192,
    comments: 35,
  },
  {
    id: "2",
    title: "Top 5 Neighborhoods for Young Professionals",
    excerpt:
      "Discover the best neighborhoods for young professionals, offering vibrant social scenes, convenient amenities, and promising career opportunities.",
    image: "/images/house2.png",
    likes: 78,
    comments: 20,
  },
  {
    id: "3",
    title: "Investing in Real Estate: A Beginner’s Guide",
    excerpt:
     "Learn the basics of real estate investing, including different investment strategies, risk management, and how to get started with your first property.",
    image: "/images/house3.png",
    likes: 160,
    comments: 42,
  },
  {
    id: "4",
    title: "Navigating the Mortgage Process: Tips and Tricks",
    excerpt:
      "Demystify the mortgage process with expert advice on securing the best rates, understanding loan options, and avoiding common pitfalls.",
    image: "/images/house4.png",
    likes: 84,
    comments: 19,
  },
  {
    id: "5",
    title: "The Future of Home Design: Trends to Watch",
    excerpt:
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
          <div
            key={post.id}
            className="flex items-center justify-between gap-6 border-b border-gray-200 pb-6"
          >
            {/* Text Content */}
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{post.title}</h2>
              <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                {post.excerpt}
              </p>
              <button className="mt-3 text-sm font-medium text-blue-600 hover:underline">
                Read More
              </button>

              {/* Likes & Comments */}
              <div className="flex items-center gap-6 text-gray-500 text-sm mt-3">
                <span>❤️ {post.likes}</span>
                <span>💬 {post.comments}</span>
              </div>
            </div>

            {/* Image */}
            <div className="w-48 h-32 relative rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
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
