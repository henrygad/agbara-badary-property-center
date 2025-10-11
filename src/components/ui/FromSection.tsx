import { ReactElement } from "react";
import { Card } from "./card";

const FromSection = ({ title, children }: { title: string, children: ReactElement }) => {
    return <section className="w-full h-auto">
        <Card className="shadow-sm py-6 px-4 md:px-6 rounded-sm text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900">
            <h2 className="text-lg text-wrap font-semibold uppercase">{title}</h2>
            <>
                {children}
            </>

        </Card>        
    </section>;
};

export default FromSection;