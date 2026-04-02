import { motion } from "framer-motion";
import {ChevronDown} from "lucide-react";

export default function WelcomeSection() {
    return (

        <div className="flex flex-col items-center justify-center
         w-full h-screen relative">
            {/*  Image + Text Container  */}
            <motion.div
                className="flex flex-col items-center gap-30"
                initial={{ opacity: 0 , y:30}}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}>

                {/*  Circular image  */}
                <motion.div
                    initial={{ opacity: 0, y:20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1}}
                    className="rounded-full w-100 h-100 border-2 border-vintage-lavender-500
                               overflow-hidden ring-6 ring-vintage-lavender-500 ring-opacity-20"
                >
                    <img
                        src="/riley.jpg"
                        alt="Riley"
                        className="w-full h-full object-cover"
                    />
                </motion.div>

                {/* Welcome text */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
                    className="font-bitcount text-6xl text-vintage-lavender-300 text-center"
                >
                    Welcome to my corner of the internet, I'm Riley!
                </motion.h1>
            </motion.div>


            {/* Scroll indicator — pinned to bottom, bounces */}
            <motion.div
                className="absolute bottom-10 flex flex-col items-center gap-1
                           text-vintage-lavender-200 "
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
            >
                <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{
                        duration: 1.4,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "loop",
                    }}
                >
                    <ChevronDown size={75} className="text-vintage-lavender-400" />
                </motion.div>
            </motion.div>
        </div>


    )
}