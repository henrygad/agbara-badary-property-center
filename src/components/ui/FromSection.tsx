import { ReactElement } from "react";
import { Card } from "./card";

const FromSection = ({ title, children }: { title: string, children: ReactElement }) => {
    return <section className="w-full h-auto">
        <Card className="shadow-sm p-6 rounded-sm hidden sm:block">
            <h2 className="text-2xl text-wrap font-semibold mb-4 capitalize">{title}</h2>
            <>
                {children}
            </>

        </Card>
        <div className="sm:hidden bg-transparent">
            <h2 className="text-2xl text-wrap font-semibold mb-4 capitalize">{title}</h2>
            <>
                {children}
            </>

        </div>
    </section>;
};

export default FromSection;