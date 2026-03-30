import {type LeftColumnProps, type Skill} from "../types.ts";
import {useEffect, useRef, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {ChevronDown, MoveUp} from 'lucide-react';
import {SKILL_TYPE, SKILLS} from "../data.ts";


const FILTER_OPTIONS = ['All', ...Object.values(SKILL_TYPE)];


export default function LeftColumn({
                                       activeSection,
                                       hasScrolled,
                                       leftColumnVisible,
                                   }: LeftColumnProps) {

    const [expanded, setExpanded] = useState(leftColumnVisible);
    const [activeFilter, setActiveFilter] = useState<string>('All');
    const [showFilter, setShowFilter] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);

    // Reset expanded when user scrolls back to top
    useEffect(() => {
        if (!hasScrolled) {
            queueMicrotask(() => setExpanded(false));
        }
    }, [hasScrolled]);

    // Close dropdown when active section changes
    useEffect(() => {
        queueMicrotask(() =>setShowFilter(false));
    }, [activeSection]);

    // Click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setShowFilter(false);
            }
        };

        if (showFilter) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showFilter]);

    // Badge highlight logic:
    // hoveredCard skills take priority over activeSection scroll position
    const isActive = (skill: Skill): boolean => {
        if (activeSection === undefined || activeSection?.sectionId === 'connect') return false;
        return skill.sectionIds.includes(activeSection?.sectionId);
    }

    // Whether a skill matches the active filter
    const matchesFilter = (skill: Skill): boolean => {
        if (activeFilter === 'All') return true;
        return skill.type === activeFilter;
    }

    // Combined opacity/scale logic:
    // 1. Does not match filter → very dim
    // 2. Matches filter + active → full + scaled up
    // 3. Matches filter + inactive → full + normal scale
    const getAnimationState = (skill: Skill) => {

        if ( activeFilter === 'All'
            || isActive(skill)
            || matchesFilter(skill)) {
            return { opacity: 1, scale: 1.05 };
        }
        return { opacity: 0.15, scale: 0.9 };
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


                {/* Work + Builder badges */}
                {/*TODO: Not all badges are showing - will need to look into that.*/}
                {activeSection !== undefined
                    && (activeSection?.sectionId === 'work'
                        || activeSection?.sectionId === 'builder')
                    && (
                        <div className="flex flex-wrap gap-2">
                            {SKILLS.filter(skill => (
                                !skill.sectionIds.includes('personal')))
                                .map((skill) => (
                                    <motion.span
                                        key={skill.name}
                                        className={`px-2 py-0.5 rounded-full font-primary text-[11px] border transition-colors
                                ${isActive(skill)
                                            ? 'hidden'
                                            : 'border-vintage-lavender-300 text-vintage-lavender-300'
                                        }`}
                                    >
                                        {skill.name}
                                    </motion.span>
                                ))}
                        </div>
                    )}

                {/* Personal badges */}
                {activeSection !== undefined &&
                    (activeSection?.sectionId === 'personal')
                    && (
                        <div className="flex flex-wrap gap-2">
                            {SKILLS.filter(skill =>
                                skill.sectionIds.includes('personal'))
                                .map((skill) => (
                                    <motion.span
                                        key={skill.name}
                                        animate={getAnimationState(skill)}
                                        transition={{ duration: 0.2 }}
                                        className="px-2 py-0.5 rounded-full font-primary text-[11px]
                                                    border transition-colors
                                                    border-vintage-lavender-300
                                                    text-vintage-lavender-300"
                                    >
                                        {skill.name}
                                    </motion.span>
                                ))}
                        </div>
                    )}

                {/* Connect section — filterable badges */}
                {activeSection !== undefined
                    && activeSection?.sectionId === 'connect'
                    && (
                        //  Filter based on type - independent of active section
                        <div className="flex flex-wrap gap-3">

                            {/*  Dropdown filter  */}
                            <div className="relative w-full" ref={filterRef}>
                                <button
                                    onClick={() => setShowFilter(prev => !prev)}
                                    className="flex items-center gap-1 text-xs
                                               text-vintage-lavender-300
                                               hover:text-vintage-lavender-300 transition-colors">
                                    {activeFilter}
                                    <ChevronDown
                                        size={12}
                                        className={`transition-transform duration-200
                                                    ${showFilter ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                <AnimatePresence>
                                    {showFilter && (
                                        <motion.div
                                            initial={{opacity: 0, y:-4}}
                                            animate={{opacity: 1, y:0}}
                                            exit={{opacity:0, y: -4}}
                                            transition={{duration: 0.15}}
                                            className="absolute top-6 left-0 z-10 flex flex-col
                                                     bg-vintage-lavender-1000 border
                                                     border-vintage-lavender-600
                                                      rounded-md py-1 min-w-32"
                                        >
                                            {FILTER_OPTIONS
                                                .filter((opt => !opt.includes('Personal')))
                                                .map((filter) =>(
                                                <button
                                                    key={filter}
                                                    onClick={() => {
                                                        setActiveFilter(filter);
                                                        setShowFilter(false);
                                                    }}
                                                    className={`px-3 py-1.5 text-left text-xs
                                                        transition-colors
                                                        hover:bg-vintage-lavender-900
                                                        ${activeFilter === filter
                                                        ? 'text-vintage-lavender-400'
                                                        : 'text-vintage-lavender-200'
                                                    }`}
                                                >
                                                    {filter}
                                                </button>

                                            ))}

                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Filtered badges */}
                            <div className="flex flex-wrap gap-2">
                                {SKILLS.filter(skill => !skill.sectionIds.includes('personal'))
                                    .map((skill) => (
                                        <motion.span
                                            key={skill.name}
                                            transition={{ duration: 0.2 }}
                                            className={`px-2 py-0.5 rounded-full font-primary text-[11px] border transition-colors
                                ${activeFilter === 'All' || skill.type.includes(activeFilter)
                                                ? 'border-vintage-lavender-300 text-vintage-lavender-300'
                                                :  'hidden'
                                            }`}
                                        >
                                            {skill.name}
                                        </motion.span>
                                    ))}
                            </div>
                        </div>
                )}
                <a
                    href="/public"
                    className="flex items-center gap-1 text-xs text-vintage-lavender-200
               hover:text-vintage-lavender-400 transition-colors"
                >
                    <MoveUp size={12} /> Back To Top
                </a>

            </div>
        </div>
    )
}