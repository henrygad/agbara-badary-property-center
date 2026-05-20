# 🏠 Agbara Badagry Property Center

A modern real estate web platform built with **Next.js**, **TypeScript**, and **Tailwind CSS**, designed to help buyers, sellers, and agents connect across the **Agbara–Badagry** and **Lusada** axis in Ogun and Lagos States, Nigeria.

---

## 🚀 Features

### 🧭 Core
- **Browse properties** for sale, rent, or lease  
- **Search and filter** by price, type, location, and more  
- **Responsive UI** built with Tailwind CSS  
- **Agent dashboard** for managing listings  
- **Admin dashboard** for approvals and management  
- **Dynamic property pages** with SEO metadata and OpenGraph tags  

### 🔐 Authentication & Authorization
- Custom **JWT authentication** using Next.js API routes  
- Firebase used for **data storage** and **security rules**  
- Middleware protection for admin and agent routes  
- “Remember Me” login persistence  
- Account verification & approval system  

### 🧩 Integration
- **Firebase Firestore** for real-time data  
- **Cloudinary** for image storage  
- **Tawk.to Live Chatbot** integration (with AI + human takeover)  
- SEO optimization using **Next.js App Router Metadata** and **next-sitemap**

### 📊 Analytics & Metrics
- Dashboard metrics for properties, agents, and requests  
- Dynamic charts with **Recharts**  
- Percentage comparison vs. last week/month  
- Real-time updates using `createdAt` timestamps  

---

## 🛠️ Tech Stack

| Category | Tools |
|-----------|-------|
| **Frontend** | Next.js 15 (App Router), React, TypeScript |
| **Styling** | Tailwind CSS, Shadcn/UI |
| **Backend** | Next.js API Routes, Firebase Firestore |
| **Auth** | Custom JWT (using `jose`) |
| **Storage** | Firebase + Cloudinary |
| **Chatbot** | Tawk.to |
| **SEO** | Next SEO, next-sitemap, JSON-LD schema |
| **Charts** | Recharts |

---

## 🧱 Folder Structure

```
src/
│
├── app/
│   ├── admin/              # Admin pages
│   ├── agent/              # Agent pages
│   ├── auth/               # Auth pages (login/register)
│   ├── api/                # API routes
│   ├── properties/         # Property listings and details
│   ├── layout.tsx
│   ├── page.tsx
│   └── middleware.ts
│
├── components/             # Reusable UI components
├── lib/                    # Firebase & helper utilities
├── utils/                  # Date, analytics & helper functions
├── styles/                 # Tailwind global styles
└── public/                 # Static assets, sitemap, robots.txt
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory and add:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_CLOUDINARY_URL=your_cloudinary_url
```

---

## 🧩 Setup & Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/agbara-badagry-property-center.git

# 2. Navigate into the project
cd agbara-badagry-property-center

# 3. Install dependencies
yarn install

# 4. Run the development server
yarn dev

# 5. Build for production
yarn build && yarn start
```

Then visit [http://localhost:3000](http://localhost:3000) 🚀

---

## 🌍 SEO Setup

- Automatic sitemap: `next-sitemap`
- JSON-LD for FAQ & property schema
- Custom `generateMetadata` for each page
- Dynamic Open Graph & Twitter meta tags

---

## 💬 Live Chatbot Integration

The chatbot (powered by **Tawk.to**) provides:
- Predefined FAQs  
- AI-assisted replies for navigation  
- Transfer to human support when needed  

Script is added via the `_document.tsx` or layout file.

---

## 🧠 Future Improvements

- Add advanced analytics dashboard  
- Real-time chat between buyers and agents  
- Multi-language support  
- Payment integration for property promotion  

---

## 🧑‍💻 Author

**Agbara Badagry Property Center Team**  
Built by [Henry loveday](mailto:henrygad.orji@gmail.com)

---

## 🔒 License

Private License — © Skybridge

This project is proprietary and confidential.
Unauthorized copying, modification, or distribution of any part of this software is strictly prohibited without prior written consent from Skybridge.

---

### 🏘️ "Connecting people with homes from Agbara to Badagry."
