import { ReactElement } from "react";

const FormSectionUI = ({ title, children }: { title: string, children: ReactElement }) => {
    return <section className="bg-white rounded-lg shadow-sm border border-slate-300  p-6">
        <h2 className="text-lg font-bold mb-4 capitalize">{title}</h2>
        <>
            {children}
        </>
    </section>;
};

export default FormSectionUI;