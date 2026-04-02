import {motion} from "framer-motion";

export default function BeyondDeskSection() {
    const imageArr = ["/temp-black-belt-1.jpg", "/temp-black-belt-2.jpg"]
    return (
        <div className="gap-y-5 pt-5" >
            <p className="pt-2 text-3xl font-primary text-vintage-lavender-300">
                On my free time when I am not building things, I spend my time creating adventures for TTPRGs,
                learning how to play guitar, or practicing self-defense through Mixed Martial Arts.
                In 2025, I received my first degree black belt, a milestone I am incredibly proud of.

            </p>
            <div className="flex flex-col items-center justify-center">

                <div className="flex flex-row gap-40 pt-10">
                    {/*  Add a img of my black belt here  */}
                    {imageArr && (
                        imageArr.map((image, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
                                whileHover={{ y:-6}}
                                className="rounded-full  w-100 h-110
                             border border-vintage-lavender-500
                             overflow-hidden ring-2
                             ring-vintage-lavender-500 ring-opacity-20"
                            >
                                <img
                                    src={image}
                                    alt={`black-belt-${i}`}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        ))
                    )}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
                    whileHover={{ y:-6}}
                    className="rounded-full w-100 h-110
                             border border-vintage-lavender-500
                             overflow-hidden ring-2
                             ring-vintage-lavender-500 ring-opacity-20"
                >
                    <img
                        src="/finn.jpg"
                        alt="pet-tax"
                        className="w-full h-full object-cover"
                    />
                </motion.div>


            </div>

            <p className="pt-10 text-3xl font-primary text-vintage-lavender-300">
                Obligated internet pet tax: meet Finn. He's been my best friend for nearly a decade.
            </p>

            <p className="pt-5 text-3xl font-primary text-vintage-lavender-300 items-start">
                As for what is coming next, keep an eye out for a fun adventure. Stay tuned.
            </p>
        </div>
    )
}