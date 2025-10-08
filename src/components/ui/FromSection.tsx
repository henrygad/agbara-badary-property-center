import { ReactElement } from "react";
import { Card } from "./card";

const FromSection = ({ title, children }: { title: string, children: ReactElement }) => {
    return <section className="w-full h-auto overflow-hidden">
        <Card className="shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4 capitalize">{title}</h2>
            <>
                {children}
            </>

        </Card>
    </section>;
};

export default FromSection;