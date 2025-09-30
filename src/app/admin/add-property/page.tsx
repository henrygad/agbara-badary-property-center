import PropertyFormEditor from "@/components/property_form_editor/Index";

export default function AddProperty() {
    return <div className="flex flex-1 justify-center p-4 sm:py-6 overflow-hidden">
        <div className="flex flex-col max-w-[960px] flex-1 gap-9 sm:gap-18">
            <header className="flex">
                <h1 className="text-2xl font-bold">Add Property</h1>
            </header>
            <main className="flex w-full">
                <PropertyFormEditor
                />
            </main>
            <footer className="flex">
                <div className="flex justify-center">
                    <p className="text-sm">&copy; copy right Agbara Badagry Property Center</p>
                </div>
            </footer>
        </div>
    </div>;
};
