## License

This project is proprietary software owned by **Skybridge**.  
All rights reserved. Unauthorized use is prohibited.

## Project started folder struction

src/
├── app/
│ ├── layout.tsx
│ ├── page.tsx  
│
│ ├── listings/
│ │ ├── page.tsx
│ │ └── [id]/page.tsx
│
│ ├── blog/
│ │ ├── page.tsx
│ │ └── [id]/page.tsx
│
│ ├── search/page.tsx
│ ├── saved/page.tsx
│
│ ├── dashboard/
│ │ ├── agent/
│ │ │ ├── page.tsx
│ │ │ ├── notifications/page.tsx
│ │ │ └── settings/page.tsx
│ │ └── admin/
│ │ ├── page.tsx
│ │ ├── notifications/page.tsx
│ │ └── settings/page.tsx
│
│ ├── auth/
│ │ ├── agent/
│ │ │ ├── login/page.tsx
│ │ │ └── register/page.tsx
│ │ └── admin/login/page.tsx
│
│ ├── contact/
│ │ ├── page.tsx
│ │ └── [agentId]/page.tsx
│
│ ├── policy/page.tsx
│ ├── terms/page.tsx
│ ├── about/page.tsx
│ ├── faq/page.tsx
│ ├── pricing/page.tsx
│ ├── support/page.tsx
│ ├── chatbot/page.tsx
│ ├── not-found.tsx
│ └── loading.tsx
│
├── components/
│ ├── Navbar.tsx
│ ├── Footer.tsx
│ ├── ChatbotWidget.tsx
│ ├── CookieConsent.tsx
│ ├── PropertyCard.tsx
│ ├── PropertyFilter.tsx
│ ├── DashboardSidebar.tsx
│ ├── SearchBar.tsx
│ ├── Pagination.tsx
│ ├── FormInput.tsx
│ │
│ ├── NotificationCard.tsx
│ ├── PricingCard.tsx
│ ├── SupportForm.tsx
│ └── SettingsForm.tsx
│
├── lib/
│ ├── firebase.ts
│ ├── cloudinary.ts
│ ├── auth.ts
│ └── firestore.ts
│
├── hooks/
│ ├── useAuth.ts
│ ├── useListings.ts
│ ├── useSaved.ts
│ ├── useNotifications.ts
│ └── useChatbot.ts
│
├── utils/
│ ├── formatDate.ts
│ ├── formatCurrency.ts
│ └── validateForm.ts
│
├── styles/
│ ├── globals.css
│ └── tailwind.css
│
└── types/
├── property.ts
├── user.ts
├── notification.ts
└── blog.ts
