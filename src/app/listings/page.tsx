// src/app/blog/[id]/page.tsx
import Image from "next/image";
import { notFound } from "next/navigation";

const post = {
  title: "The Ultimate Guide to Buying Your First Home",
  date: "By Sarah Miller · Published on January 15, 2024",
  author: {
    name: "John Doe",
    avatar: "/images/avatar.png",
  },
  hero: "/images/house1.png",
  content: [
    {
      text: "Buying your first home is a significant milestone, filled with excitement and anticipation. However, it can also be a complex process, requiring careful planning and decision-making. This guide aims to simplify the journey, providing you with essential steps and insights to navigate the home-buying process successfully.",
    },
    {
      heading: "Step 1: Assess Your Financial Readiness",
      text: "Before diving into the real estate market, it's crucial to understand your financial standing. Start by evaluating your income, expenses, and debts to determine how much you can comfortably afford. This involves calculating your debt-to-income ratio and assessing your credit score, which will influence your mortgage options and interest rates.Before you start house hunting, it’s crucial to know how much you can afford. Getting pre-approved helps you understand your budget and shows sellers that you’re a serious buyer.",
    },
    {
      heading: "Step 2: Get Pre-Approved for a Mortgage",
      text: "Getting pre-approved for a mortgage is a critical step that shows sellers you're a serious buyer. It involves submitting your financial information to a lender, who will then provide you with a pre-approval letter indicating the maximum loan amount you qualify for. This not only helps you narrow down your home search but also strengthens your negotiating position.",
    },
    {
      heading: "Step 3:  Find a Real Estate Agent",
      text: "A knowledgeable real estate agent can be an invaluable asset in your home-buying journey. They can provide insights into the local market, help you find properties that meet your criteria, and guide you through the complexities of making offers and closing the deal. Look for an agent with a proven track record and positive reviews from past clients.",
    },
    {
      heading: "Step 4:  Start Your Home Search",
      text: "With your pre-approval in hand and an agent by your side, it's time to start searching for your dream home. Utilize online real estate portals, attend open houses, and work closely with your agent to identify properties that align with your needs and budget. Be prepared to view multiple homes and consider various factors, such as location, size, condition, and potential resale value.",
    },
    {
      heading: "Step 5: Start House Hunting",
      text: "Once you've found a home you love, your agent will help you craft a competitive offer. This involves determining the right price, considering contingencies (such as inspections and financing), and negotiating with the seller. Be prepared for potential counteroffers and be ready to walk away if the terms aren't favorable.",
    },
    {
      heading: "Step 6: Secure Financing and Close the Deal",
      text: "After your offer is accepted, you'll work with your lender to finalize your mortgage. This includes providing necessary documentation, undergoing an appraisal, and securing homeowners insurance. Once all conditions are met, you'll proceed to closing, where you'll sign the necessary paperwork and officially become a homeowner.",
    },
    {
      text: "Buying your first home is a significant achievement. By following these steps and seeking professional guidance, you can navigate the process with confidence and find a home that meets your needs and aspirations. Remember, patience and thoroughness are key to a successful home-buying experience",
    },
  ],
  likes: 120,
  comments: [
    {
      id: 1,
      author: "Emily Carter",
      avatar: "/images/Avatar1.png",
      text: "This guide is incredibly helpful! I'm a first-time homebuyer and was feeling overwhelmed, but this breaks it down perfectly. Thank you!",
      date: "2 days ago",
    },
    {
      id: 2,
      author: "David Lee",
      avatar: "/images/avatar2.png",
      text: "Great article! The step-by-step approach is very clear and easy to follow. I especially appreciate the emphasis on getting pre-approved for a mortgage early on.",
      date: "1 week ago",
    },
  ],
  related: [
    {
      id: "2",
      title: "Investing in Real Estate: A Beginner’s Guide",
      description:
        "Learn the basics of real estate investing, including different investment strategies, risk management, and how to get started with your first property.",
      image: "/images/house2.png",
      likes: 150,
      comments: 40,
    },
    {
      id: "3",
      title: "Top 5 Neighborhoods for Young Professionals",
      description:
        "Discover the best neighborhoods for young professionals, offering vibrant social scenes, convenient amenities, and promising career opportunities.",
      image: "/images/house3.png",
      likes: 85,
      comments: 22,
    },
  ],
};

export default function BlogPostPage() {
  if (!post) return notFound();

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 font-sans text-gray-800 bg-white">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {post.date} · by{" "}
        <span className="font-medium text-gray-700">{post.author.name}</span>
      </p>

      {/* Hero Image */}
      <div className="mb-8">
        <Image
          src={post.hero}
          alt={post.title}
          width={900}
          height={500}
          className="rounded-lg w-full object-cover"
        />
      </div>

      {/* Content */}
      <article className="prose prose-lg max-w-none">
        {post.content.map((section, index) => (
          <section key={index} className="mb-6">
            {section.heading && (
              <h2 className="text-2xl font-semibold mb-3">{section.heading}</h2>
            )}
            <p className="leading-relaxed text-lg">{section.text}</p>
          </section>
        ))}
      </article>

      {/* Like + Comment Count */}
      <div className="flex items-center gap-6 my-6 text-sm text-gray-600">
        <span>👍 {post.likes} Likes</span>
        <span>💬 {post.comments.length} Comments</span>
      </div>

      {/* Comments Section */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-6">Comments</h3>
        <div className="space-y-6">
          {post.comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-4">
              <Image
                src={comment.avatar}
                alt={comment.author}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="font-semibold">{comment.author}</p>
                  <span className="text-sm text-gray-500">{comment.date}</span>
                </div>
                <p className="mt-1 text-gray-700 leading-relaxed">
                  {comment.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Comment Form */}
      <div className="mt-8">
        <h4 className="font-semibold mb-2">Leave a Comment</h4>
        <textarea
          className="w-full border rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-red-500"
          rows={3}
          placeholder="Write your comment..."
        />
        <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Post Comment
        </button>
      </div>

      {/* Related Posts */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-6">Related Posts</h3>
        <div className="space-y-8">
          {post.related.map((related) => (
            <div
              key={related.id}
              className="flex flex-col md:flex-row items-center md:items-start gap-6 border rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              {/* Left: Text */}
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-2">{related.title}</h4>
                <p className="text-gray-600 mb-3">{related.description}</p>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm">
                  Read More
                </button>
                {/* Likes + Comments */}
                <div className="flex items-center gap-6 mt-4 text-gray-500 text-sm">
                  <span className="flex items-center gap-1">❤️ {related.likes}</span>
                  <span className="flex items-center gap-1">💬 {related.comments}</span>
                </div>
              </div>

              {/* Right: Image */}
              <Image
                src={related.image}
                alt={related.title}
                width={240}
                height={160}
                className="rounded-lg object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
