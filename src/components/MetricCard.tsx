import { LucideProps } from 'lucide-react';
import React, { ForwardRefExoticComponent, RefAttributes } from 'react'
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useRef } from "react";

type Props = {
    title: string,
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>,
    iconColor: string,
    value: string,
    duration: string,
    suffix: string
    suffixColor: string
    delay?: number
};

export default function MetricCard({ title, icon: Icon, iconColor, value, suffix, suffixColor, duration, delay = 0 }: Props) {
    const ref = useRef(null);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay }}
        >
            <div ref={ref} className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow border border-slate-50">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                            {title}
                        </p>
                        <p className="text-3xl font-bold text-text-light dark:text-text-dark">
                            <CountUp start={0} end={Number(value)} duration={5} />
                        </p>
                        <p className={`text-sm ${suffixColor}`} >{suffix} {duration}</p>
                    </div>
                    <div className={`${iconColor} p-2 rounded-lg`} >
                        <Icon className="h-8 w-8" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

