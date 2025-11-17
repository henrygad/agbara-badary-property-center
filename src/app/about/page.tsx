import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Agbara Badagry Property Center",
  description:
    "Learn about Agbara Badagry Property Center — your trusted property hub for homes, lands, and rentals along the Agbara–Badagry expressway.",
};


export default function page() {
  return (
    <div className='text-sm'>
      {/* Hero */}
      <section className="py-6">
        <div className="mx-auto text-center">
          <h1 className="text-2xl font-semibold mb-3">
            About
          </h1>
          <p className='max-w-3xl mx-auto text-base'>Agbara Badagry Property Center</p>
        </div>
      </section>
      <section className='p-3 mb-20'>
        <p className="text-sm">
          Agbara Badagry Property Center is a member of Skybridge Group. Agbara Badagry Property Center services is a real estate platform that provides property listings, sales and rental advertising, property management visibility, connection services between property owners, licensed agents, prospect investors tenants.<br />

          Agbara Badagry Property Center is a licenced real estate agency firm experienced in :- <br />
          <br />
          * Property development <br />
          * Property valuation <br />
          * Real Estate consulting <br />
          * Real Estate investment analysis <br />
          * Legal services <br />
        </p>       
      </section>
    </div>)  
}

