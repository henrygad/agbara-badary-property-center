import ShortPropertyDashbordCard from "@/components/short_property_dashbord_card/Index";

export default function AdminDashboard() {


    return <div className="flex flex-1 justify-center p-4 sm:py-6 overflow-hidden">
        <div className="flex flex-col max-w-[960px] flex-1 gap-9 sm:gap-18">
            <header className="flex">
                <h1 className="text-2xl font-bold">List of Property</h1>
            </header>
            <main className="flex w-full">
                <div>
                    <ShortPropertyDashbordCard />
                </div>
            </main>
            <footer className="flex">
                <div className="flex justify-center">
                    <p className="text-sm">&copy; copy right Agbara Badagry Property Center</p>
                </div>
            </footer>
        </div>
    </div>;
};
