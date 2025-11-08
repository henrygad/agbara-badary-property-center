import { ArrowDown, ArrowUp, LucideProps } from 'lucide-react';
import React, { ForwardRefExoticComponent, RefAttributes } from 'react'
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useRef } from "react";
import { cn } from '@/lib/utils';


interface MetricCardProps {
    title: string;
    value: number;
    change: number;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>,
    iconColor: string,
}


export default function MetricCard({ title, icon: icon, iconColor, value, change }: MetricCardProps) {
    const ref = useRef(null);
    const isPositive = change >= 0;
    const Icon = icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0 }}
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
                        <div
                            className={cn(
                                "flex items-center text-sm font-medium mt-1",
                                isPositive ? "text-green-600" : "text-red-600"
                            )}
                        >
                            {isPositive ? (
                                <ArrowUp className="h-4 w-4 mr-1" />
                            ) : (
                                <ArrowDown className="h-4 w-4 mr-1" />
                            )}
                            {Math.abs(change)}% {isPositive ? "this period" : "from last period"}
                        </div>
                    </div>
                    <div className={`${iconColor} p-2 rounded-lg`} >
                        <Icon className="h-8 w-8" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

