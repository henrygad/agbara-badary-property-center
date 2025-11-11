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
        <p>
          Welcome to Agbara Badagry Property Center. By accessing or using agbarabadagrypropertycenter.com (the “Website”), you agree to be bound by these Terms and Conditions. Please read them carefully before using this website.
          If you do not agree with these Terms, you must not use our Website.
        </p>
        <p>
          <br />
          Agbara Badagry Property Center is an online real estate platform that provides property listings, sales and rental advertising, property management visibility, and connection services between property owners, agents, and prospective buyers or tenants.
          In addition to our online platform, we also act as a licensed estate agent in all transactions representing buyers, sellers, landlords, or tenants when make use of our platform and  by whom.
          We do not collect payments online. All transactions are arranged directly or through our authorized representatives.

        </p>
      </section>
    </div>)  
}

