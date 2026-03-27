import {type LeftColumnProps, type Skill, SKILLS} from "../types.ts";
import {useEffect, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import { MoveUp } from 'lucide-react';

export default function LeftColumn({
                                       activeSection,
                                       hasScrolled,
                                       hoveredCard,
                                       leftColumnVisible,
                                   }: LeftColumnProps) {

    const [expanded, setExpanded] = useState(leftColumnVisible);

    // Reset expanded when user scrolls back to top
    useEffect(() => {
        if (!hasScrolled) {
            queueMicrotask(() => setExpanded(false));
        }
    }, [hasScrolled]);

    // Badge highlight logic:
    // hoveredCard skills take priority over activeSection scroll position
    const isActive = (skill: Skill): boolean => {
        if(hoveredCard) {
            return hoveredCard.skills.some(s => s.name === skill.name);
        }
        if (activeSection === undefined || activeSection?.sectionId === 'connect') return false;
        return skill.sectionIds.includes(activeSection?.sectionId);
    }

    const isCollapsed = leftColumnVisible && hasScrolled && !expanded;

    return (
        <div className="flex flex-col h-full px-8 py-10 justify-between">
            {/*  Top section: Header + Intro + Badges  */}
            <div className="flex flex-col gap-6">
                {/* Header */}
                <h1 className="font-bitcount text-3xl text-vintage-lavender-300">
                    The Engineer
                </h1>

                {/*  Intro with Collapsable Animation  */}
                <div className="relative">
                    <motion.div
                        animate={{height: isCollapsed ? '4.5rem' : 'auto' }}
                        transition={{duration: 0.4, ease: 'easeInOut'}}
                        className="overflow-hidden">
                        <p className="text-sm loading-relaxed font-primary text-vintage-lavender-300">
                            I am a Senior Software Engineer with over 11 years of experience
                            building backend systems, APIs, and full-stack products. I care
                            deeply about the craft, not just writing code that works, but
                            writing code that is maintainable, well-documented, and
                            thoughtfully designed. I thrive at the intersection of complexity
                            and ownership, and I have a tendency to follow problems all the
                            way through to their logical end rather than stopping at the
                            obvious place. I am currently based in the Southeast and making
                            the move to New York City, where I am actively looking for my
                            next senior engineering role.
                        </p>
                    </motion.div>

                    {/*  Gradient fade overlay - only visible when collapsed  */}
                    <AnimatePresence>
                        {isCollapsed && (
                            <motion.div
                                initial={{opacity: 1}}
                                animate={{opacity: 1}}
                                exit={{opacity:0}}
                                transition={{duration: 0.3}}
                                className="absolute bottom-0 left-0 right-0 h-8
                                 bg-linear-to-t from-vintage-lavender-1000
                                 to-transparent pointer-events-none"
                                />
                        )}
                    </AnimatePresence>

                    {/* Read more / collapse toggle */}
                    <AnimatePresence>
                        {hasScrolled && (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setExpanded(prev => !prev)}
                                className="mt-1 text-xs text-vintage-lavender-400
                                           hover:text-vintage-lavender-200 transition-colors"
                            >
                                {expanded ? 'collapse' : 'read more'}
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>

                {activeSection !== undefined && activeSection?.sectionId === 'personal'
                && (
                        <div className="flex flex-wrap gap-2">
                            {SKILLS.filter(skill =>
                                skill.sectionIds.includes('personal'))
                                .map((skill) => (
                                <motion.span
                                    key={skill.name}
                                    animate={{
                                        opacity: isActive(skill) ? 1 : .5,
                                        scale: isActive(skill) ? 1.05 : 1,
                                    }}
                                    transition={{ duration: 0.2 }}
                                    className={`px-3 py-1 rounded-full font-primary text-xm border transition-colors
                                ${isActive(skill)
                                        ? 'border-vintage-lavender-400 text-vintage-lavender-400'
                                        : 'border-vintage-lavender-200 text-vintage-lavender-200'
                                    }`}
                                >
                                    {skill.name}
                                </motion.span>
                            ))}
                        </div>
                    )}
                {activeSection !== undefined && activeSection?.sectionId !== 'personal'
                && (
                    <div className="flex flex-wrap gap-2">
                        {SKILLS.filter(skill => (
                            !skill.sectionIds.includes('personal')))
                            .map((skill) => (
                                <motion.span
                                    key={skill.name}
                                    animate={{
                                        opacity: isActive(skill) ? 1 : .5,
                                        scale: isActive(skill) ? 1.05 : 1,
                                    }}
                                    className={`px-2 py-0.5 rounded-full font-primary text-xm border transition-colors
                                ${isActive(skill)
                                        ? 'border-vintage-lavender-400 text-vintage-lavender-400'
                                        : 'border-vintage-lavender-200 text-vintage-lavender-200'
                                    }`}
                                >
                                    {skill.name}
                                </motion.span>
                            ))}
                    </div>
                )}
            </div>
            <a
                href="/"
                className="flex items-center gap-1 text-xs text-vintage-lavender-200
               hover:text-vintage-lavender-400 transition-colors"
            >
                <MoveUp size={12} /> Back To Top
            </a>
        </div>
    )
}