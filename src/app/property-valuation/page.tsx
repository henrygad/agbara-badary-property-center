import Link from "next/link";

export default function page() {
  return <div className='text-sm'>
    {/* Hero */}
    <section className="py-6">
      <div className="mx-auto text-center">
        <h1 className="text-2xl font-semibold">
          Valuation services
        </h1>
      </div>
    </section>
    <section className='p-3 mb-20 text-sm'>
      <p>
        Trusted Valuation Experts for the Agbara–Badagry Real Estate Market
        At Agbara Badagry Property Center, we understand that knowing the true value of a property is essential for making smart real estate decisions. Whether you are buying, selling, financing, developing, or managing property, our comprehensive property valuation service equips you with accurate, reliable, and market-aligned insights.
        With our deep understanding of the Agbara–Badagry axis and surrounding industrial and residential corridors, we deliver valuation reports that meet the highest professional standards.
      </p>
      <h2 className="text-base font-semibold my-2">What we offer</h2>
      <p>
        1. Residential Property Valuation <br />
        We provide valuation for: <br />
        •	Houses and duplexes <br />
        •	Flats and apartments <br />
        •	Bungalows and self-contained units <br />
        •	Residential lands and estates <br />
        Our assessments consider location, structural condition, market demand, and current sales data. <br />
        <br />

        2. Commercial & Industrial Property Valuation<br />
        Ideal for: <br />
        •	Warehouses <br />
        •	Factories <br />
        •	Shops and plazas <br />
        •	Office buildings <br />
        •	Petrol stations <br />
        •	Hospitality properties <br />
        We analyze zoning, accessibility, economic activity, rental income potential, and comparable market values. <br />
        <br />

        3. Land Valuation<br />
        We value: <br />
        •	Bare lands <br />
        •	Industrial layouts <br />
        •	Agricultural lands <br />
        •	Mixed-use and future development sites <br />
        Our team evaluates land use potential, topography, accessibility, and market trends.<br />
        <br />

        4. Valuation for Financial and Legal Purposes <br />
        Our valuation reports are suitable for: <br />
        •	Bank loans and mortgages <br />
        •	Asset documentation <br />
        •	Property sales and purchases <br />
        •	Investment analysis <br />
        •	Insurance assessments <br />
        •	Probate and estate planning <br />
        Every report is prepared with clarity and accuracy for institutional acceptance. <br />        
      </p>
      <h2 className="text-base font-semibold my-2">Our Valuation Methodology</h2>
      <p>
        We use globally recognized and industry-approved valuation approaches: <br />
        •	Market Comparison Approach – Uses current local sales data <br />
        •	Cost Approach – Considers replacement and construction costs <br />
        •	Income Approach – For rental and income-generating properties <br />
        This ensures a fair, defendable, and transparent valuation outcome. <br />
      </p>
      <h2 className="text-base font-semibold my-2">Why Choose Us?</h2>
      <p>
        ✔ Local Market Expertise – Extensive knowledge of Agbara, Badagry, Lusada, Atan, Alade, Magbon, Igbesa, and surrounding neighborhoods. <br />
        ✔ Professional Reporting – Clear, comprehensive, and easy-to-understand valuation documents. <br />
        ✔ Fast Turnaround – Timely delivery without compromising accuracy. <br />
        ✔ Client-Focused Service – We prioritize your goals and provide guidance where needed. <br />
        ✔ Confidential & Ethical – Your information is handled with utmost discretion and professionalism. <br />
      </p>
      <h2 className="text-base font-semibold my-2">Who Needs Our Valuation Service?</h2>
      <p>
        •	Property owners <br />
        •	Homebuyers <br />
        •	Real estate investors <br />
        •	Developers <br />
        •	Financial institutions <br />
        •	Legal practitioners <br />
        •	Corporate organizations <br />
        •	Estate administrators <br />
        If you need to know the real worth of your property, we are here to serve. <br />
      </p>
      <br />
      <p>
        Get Started Today <br />
        For professional valuation of your property, <Link href="/contact" className="text-primary">contact us</Link>
      </p>
    </section>
  </div >
}

