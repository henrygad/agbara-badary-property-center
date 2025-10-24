"use client";

import SearchForm from "../components/SearchForm";
import backgroundimage from "../../public/images/background-image-for-slider.jpg";
import { Building2, ThumbsUp, Users, Star } from "lucide-react";
import CountUp from "react-countup";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function Home() {


  return <div className="relative">
    {/* Hero */}
    <section
      className="relative bg-cover bg-center h-[500px] rounded-sm"
      style={{ backgroundImage: `url(${typeof backgroundimage === "string" ? backgroundimage : backgroundimage?.src})` }}
    >
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-50 rounded-sm"></div>
      <div className="absolute -top-7 sm:top-0 left-0 right-0 bottom-0 text-white mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center z-20">
        {/* Intro text */}
        <h1 className="text-4xl md:text-5xl font-bold mb-2">Find Your Dream House</h1>
        <p className="text-lg mb-8">Buy, Rent, or Short let properties with trusted agents.</p>
      </div>
    </section>

    {/* Search form */}
    <section className="w-full flex justify-center -mt-40 px-2 relative z-20">
      <div className="w-full max-w-4xl bg-white p-4 rounded-lg shadow-lg">
        <SearchForm />
      </div>
    </section>

    {/* Statics */}
    <section className="bg-background-light dark:bg-background-dark py-16 mt-10 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-red-100 dark:bg-red-900/20 rounded-full p-4 mb-4">
              <Building2 size={30} />
            </div>
            <p className="text-xl font-bold text-text-light dark:text-text-dark">
              <CountUp start={0} end={Number("2500")} duration={5} />+
            </p>
            <p className="text-subtext-light dark:text-subtext-dark">Properties Listed</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-red-100 dark:bg-red-900/20 rounded-full p-4 mb-4">
              <Users size={30} />
            </div>
            <p className="text-xl font-bold text-text-light dark:text-text-dark">
              <CountUp start={0} end={Number("150")} duration={5} />+
            </p>
            <p className="text-subtext-light dark:text-subtext-dark">Verified Agents</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-red-100 dark:bg-red-900/20 rounded-full p-4 mb-4">
              <ThumbsUp size={30} />
            </div>
            <p className="text-xl font-bold text-text-light dark:text-text-dark">
              <CountUp start={0} end={Number("1200")} duration={5} />+
            </p>
            <p className="text-subtext-light dark:text-subtext-dark">Successful Deals</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-red-100 dark:bg-red-900/20 rounded-full p-4 mb-4">
              <Star size={30} />
            </div>
            <p className="text-xl font-bold text-text-light dark:text-text-dark">
              {/* <CountUp start={0} end={Number(4.8/5)} duration={5} />/5 */}
              4.8/5
            </p>
            <p className="text-subtext-light dark:text-subtext-dark">Customer Rating</p>
          </div>
        </div>
      </div>
    </section>

    {/* Your Last Searches */}
    {/* <section className="bg-card-light dark:bg-card-dark py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-center mb-8 text-text-light dark:text-text-dark">Your Last Searches</h2>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md flex justify-between items-center w-full md:w-1/3">
            <div>
              <p className="font-semibold text-text-light dark:text-text-dark">Property for Sale in Nigeria</p>
              <p className="text-sm text-subtext-light dark:text-subtext-dark">3 Bedroom apartment in Agbara area</p>
            </div>
            <a className="text-primary" href="#"><span className="material-icons">arrow_forward</span></a>
          </div>
          <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md flex justify-between items-center w-full md:w-1/3">
            <div>
              <p className="font-semibold text-text-light dark:text-text-dark">Property for Rent in Nigeria</p>
              <p className="text-sm text-subtext-light dark:text-subtext-dark">2 Bedroom flat in Badagry corridor</p>
            </div>
            <a className="text-primary" href="#"><span className="material-icons">arrow_forward</span></a>
          </div>
        </div>
      </div>
    </section> */}

    {/* Featured Real Estate Companies */}
    {/* <section className="bg-background-light dark:bg-background-dark py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-center mb-8 text-text-light dark:text-text-dark">Featured Real Estate Companies</h2>
        <div className="flex flex-wrap justify-center items-center gap-8">
          <div className="bg-card-light dark:bg-card-dark px-6 py-3 rounded-lg shadow-sm">
            <p className="font-medium text-text-light dark:text-text-dark">Blushedge</p>
          </div>
          <div className="bg-card-light dark:bg-card-dark px-6 py-3 rounded-lg shadow-sm">
            <p className="font-medium text-text-light dark:text-text-dark">Jide Taiwo &amp; Co</p>
          </div>
          <div className="bg-card-light dark:bg-card-dark px-6 py-3 rounded-lg shadow-sm">
            <p className="font-medium text-text-light dark:text-text-dark">Property Pro</p>
          </div>
          <div className="bg-card-light dark:bg-card-dark px-6 py-3 rounded-lg shadow-sm">
            <p className="font-medium text-text-light dark:text-text-dark">Estate Link</p>
          </div>
        </div>
      </div>
    </section> */}

    {/* Are you an Agent */}
    <section className="bg-card-light dark:bg-card-dark sm:py-20 py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex gap-4 flex-wrap justify-center">
        <h3 className="text-2xl font-semibold mb-4 text-gray-900 text-center">Are you an estate agent or developer? List your property for FREE.</h3>
        <Button variant="destructive" className="bg-primary text-white px-8 py-3 rounded-md font-medium cursor-pointer">Get Started</Button>
      </div>
    </section>

    {/* Lasted properties */}
    <section className="bg-background-light dark:bg-background-dark py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-text-light dark:text-text-dark">Recently Added Properties</h2>
          <Link className="text-primary font-medium text-nowrap whitespace-pre" href="#">View All</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-lg overflow-hidden">
            <div className="relative">
              <img alt="Modern 3-Bedroom Duplex" className="w-full h-56 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDb57oWLSd8oycFRNeOaQIh6V9bZNmtn7RqHW4IPFQXuC1LODT86cYlFr424ov3P0Xo4tGLOdrWr_hkgX8am0xGU5VfogmVt0Ji0dzarC7GQhTkxytGRU4vlyxiJmzCggTMVQ_Gt3ArG6zJqE17ttahyiGh1rg_Usj_AB7vzmpkj5S9krd1Bg4Q_zCUyIgYDZAfdIcVN33RgMbMvhMLIiQ1aYntq45U0NK0nb_cfXVGaclNWZAhXIuGRKeesfmGnDEtHFqpUDKX9Vo" />
              <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">For Sale</div>
              <button className="absolute top-2 right-2 bg-white/70 p-2 rounded-full text-gray-700 hover:text-primary">
                <span className="material-icons">favorite_border</span>
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-text-light dark:text-text-dark">Modern 3-Bedroom Duplex</h3>
              <p className="text-subtext-light dark:text-subtext-dark mb-4">Prime Location Estate</p>
              <p className="text-2xl font-bold text-primary mb-4">₦15.5M</p>
              <div className="flex items-center text-subtext-light dark:text-subtext-dark space-x-4 mb-4">
                <span className="flex items-center"><span className="material-icons text-sm mr-1">bed</span> 2</span>
                <span className="flex items-center"><span className="material-icons text-sm mr-1">bathtub</span> 2</span>
                <span className="flex items-center"><span className="material-icons text-sm mr-1">square_foot</span> 2</span>
              </div>
              <a className="block text-center w-full py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition" href="#">View Details</a>
            </div>
          </div>
          <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-lg overflow-hidden">
            <div className="relative">
              <img alt="Luxury 2-Bedroom Apartment" className="w-full h-56 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0IhcRbquCuP7Mvi65IuUVSCHME3HQtJSCnJC7HUUCOwinA9guNGIgqix2ing6183v1YtJUxLMW5buToUFMnRERAVgtmfyhrokOyb5VX5vljyV7RNetiG7JWTBHD9sCua7443sfHN_2_eIeJk6XoVDZmB8skCnBlJYNGKP8WqBW1WHt94TsD_cpcfWRrFHd2hXkRnQthSsQ4u8ID5KHsA1wmswZ3L6vRFDXFSmLi1NWUe9XhPFN9ELW2Fl7Jo7Ipvl-7EAxd6LX0c" />
              <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">For Rent</div>
              <button className="absolute top-2 right-2 bg-white/70 p-2 rounded-full text-gray-700 hover:text-primary">
                <span className="material-icons">favorite_border</span>
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-text-light dark:text-text-dark">Luxury 2-Bedroom Apartment</h3>
              <p className="text-subtext-light dark:text-subtext-dark mb-4">Central Hub, Badagry</p>
              <p className="text-2xl font-bold text-primary mb-4">₦800K/yr</p>
              <div className="flex items-center text-subtext-light dark:text-subtext-dark space-x-4 mb-4">
                <span className="flex items-center"><span className="material-icons text-sm mr-1">bed</span> 2</span>
                <span className="flex items-center"><span className="material-icons text-sm mr-1">bathtub</span> 2</span>
                <span className="flex items-center"><span className="material-icons text-sm mr-1">square_foot</span> 1</span>
              </div>
              <a className="block text-center w-full py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition" href="#">View Details</a>
            </div>
          </div>
          <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-lg overflow-hidden">
            <div className="relative">
              <img alt="Spacious 4-Bedroom Bungalow" className="w-full h-56 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoINDpF-JAjJOAKeneNIbyJFiLwFLo-7acH-t88t0MRlm9A0YDbm6U9axedXReKy55bXeJu85tHQt5MQ0Cw6HZqefOcHNamrRC8wqhxsP9YhPgtaX0gXDDVBcN5I_5NSHPY09PgN2SbD6F4V9HkMW2jUfj6Bi3T85dHFUNYz7RUalKThnURtHiGYi4Xo4Nv3XMNuIlFVjON44HEWvZzUtObsBJsOzq2Y7e2CnjSC22F-YQjNwLBpbEneYpSpxZba91VICicC0fKQs" />
              <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">For Sale</div>
              <button className="absolute top-2 right-2 bg-white/70 p-2 rounded-full text-gray-700 hover:text-primary">
                <span className="material-icons">favorite_border</span>
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-text-light dark:text-text-dark">Spacious 4-Bedroom Bungalow</h3>
              <p className="text-subtext-light dark:text-subtext-dark mb-4">Peaceful Green Corner</p>
              <p className="text-2xl font-bold text-primary mb-4">₦12.8M</p>
              <div className="flex items-center text-subtext-light dark:text-subtext-dark space-x-4 mb-4">
                <span className="flex items-center"><span className="material-icons text-sm mr-1">bed</span> 4</span>
                <span className="flex items-center"><span className="material-icons text-sm mr-1">bathtub</span> 3</span>
                <span className="flex items-center"><span className="material-icons text-sm mr-1">square_foot</span> 2</span>
              </div>
              <a className="block text-center w-full py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition" href="#">View Details</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
}

