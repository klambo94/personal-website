import { motion } from "framer-motion";
import type {WorkCardProps} from "../types.ts";
import {useEffect, useRef, useState} from "react";

export default function WorkCard({ card, delay }: WorkCardProps) {
    const [visible, setVisible] = useState(false);
    const [expanded, setExpanded] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);


    return (
        <div className="flex flex-col">
            {/*Work Section Card*/}
            <motion.div
                ref={ref}
                initial={{opacity: 0, y: 20}}
                animate={visible ? {opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: delay }}
                whileHover={{ y:-4}}
                onClick={() => setExpanded(prev => !prev)}
                className="flex flex-col gap-3 p-6 rounded-lg border border-vintage-lavender-600
                       hover:border-vintage-lavender-400 cursor-default transition-all
                        hover:shadow-lg hover:shadow-vintage-lavender-800
                       bg-vintage-lavender-1000 bg-opacity-40 w-full"
            >
                <h2 className="font-bitcount text-2xl text-vintage-lavender-300">
                    {card.name}
                </h2>

                {/* Role */}
                {card.role && (
                    <p className="text-xs font-primary text-vintage-lavender-400 uppercase tracking-widest">
                        {card.role}
                    </p>
                )}

                {/* Dates */}
                {card.dates && (
                    <p className="text-xs font-primary text-vintage-lavender-200">
                        {card.dates[0]} — {card.dates[1]}
                    </p>
                )}

                {/* Description */}
                <p className="text-sm font-primary text-vintage-lavender-300 leading-relaxed">
                    {card.description}
                </p>

            </motion.div>
            {/*More Details...*/}
            <motion.div
                initial={{opacity: 0, height: 0}}
                animate={expanded ? {opacity: 1, height: "auto"} : {opacity: 0, height: 0}}
                transition={{duration: 0.4, ease: "easeInOut"}}
                className="mt-4 w-full flex border-vintage-lavender-600 border rounded-lg p-3
                       hover:border-vintage-lavender-400 cursor-auto transition-all
                         hover:-translate-y-2 hover:  hover:shadow-lg hover:shadow-vintage-lavender-800
                       bg-vintage-lavender-1000 bg-opacity-40 text-vintage-lavender-400 font-primary"
            >
                <div className="flex gap-2">
                    {card.awards !== undefined && (
                        <div className="flex flex-col w-full">
                            <div className="py-3 font-bitcount text-sm">Achievements</div>
                            {card.awards?.map(award => (
                                <div key={award.name + award.description} className="font-bold py-2 text-xs">
                                    {award.name}
                                    <div className="font-light">{award.description}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* STAR column */}
                    <div className="flex flex-col w-full">
                        <div className="py-3 font-bitcount text-sm">STAR Situations</div>
                        {card.stars?.map(star => (
                            <div key={star.name} className="font-bold py-2 text-xs">
                                {star.name}
                                <div className="py-3">
                                    <div className="font-light">{star.situation}</div>
                                    <br/>
                                    <div className="font-light">{star.action}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    )
}