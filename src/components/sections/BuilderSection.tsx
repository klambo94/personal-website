import { motion } from "framer-motion";
import type {GithubRepo} from "../../types.ts";
import {ArrowRight} from "lucide-react";

export default function BuilderSection({githubRepos}: { githubRepos: GithubRepo[] }) {
    return (
        <div className="flex flex-col gap-y-3 p-y-5 pt-5 ">
            {githubRepos.map((repo: GithubRepo) => (
                <motion.div
                    key={repo.id}
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    whileHover={{ y:-4, transition: { duration: 0.1, ease: "easeInOut" }}}
                    className="gap-3 p-6 rounded-xl border-3 border-vintage-lavender-600
                       hover:border-vintage-lavender-400 cursor-default transition-all
                        hover:shadow-lg hover:shadow-vintage-lavender-800 text-vintage-lavender-200
                       bg-vintage-lavender-1000 bg-opacity-40"
                >
                    <div className="flex flex-col">
                        <div className="flex flex-row gap-x-3">
                            <h2 className="font-bitcount text-4xl text-vintage-lavender-300">
                                {repo.name}
                            </h2>

                            {/*  Link to Github  */}
                            <a href={repo.html_url}
                               target="_blank"
                               rel="noreferrer"
                               onClick={(e) => e.stopPropagation()}
                               className="text-vintage-lavender-400
                                                hover:-translate-y-1
                                               hover:text-vintage-lavender-200
                                                transition-colors"><ArrowRight /></a>
                        </div>
                        {/* Description */}
                        <p className="text-2xl font-primary text-vintage-lavender-300 leading-relaxed">
                            {repo.description}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}