import { useEffect, useRef, useState} from "react";
import LeftColumn from "./LeftColumn.tsx";
import type { RefObject } from "react";
import RightColumn from "./RightColumn.tsx";
import WelcomeSection from "./sections/WelcomeSection.tsx";
import {AnimatePresence, motion} from "framer-motion";
import {SECTIONS} from "../data.ts";
import type {Section, SectionId} from "../types.ts";
import {useGithubRepos} from "../hooks/useGithubRepos.ts";




export default function MainLayout() {
    const [activeSection, setActiveSection] = useState<Section | undefined>(SECTIONS[0]);
    const [hasScrolled, setHasScrolled] = useState<boolean>(false);
    const [leftColumnVisible, setLeftColumnVisible] = useState<boolean>(false);
    const welcomeSectionRef = useRef<HTMLDivElement>(null)
    const workSectionRef = useRef<HTMLDivElement>(null);
    const builderSectionRef = useRef<HTMLDivElement>(null);
    const personalSectionRef = useRef<HTMLDivElement>(null);
    const connectSectionRef = useRef<HTMLDivElement>(null);

    const githubResponse = useGithubRepos("klambo94", 5);

    const sectionRefs: Record<SectionId, RefObject<HTMLDivElement | null>> = {
        welcome: welcomeSectionRef,
        work: workSectionRef,
        builder: builderSectionRef,
        personal: personalSectionRef,
        connect: connectSectionRef,
    };

    useEffect(() => {
        if(activeSection?.sectionId !== 'welcome' && !leftColumnVisible) {
            queueMicrotask(() => setLeftColumnVisible(false));
        }
    }, [activeSection]);

    // Intro collapse
    useEffect(() => {
        const handleScroll = () => {
            if(window.scrollY > 50 && !hasScrolled) {
                setHasScrolled(true);
            } else if(window.scrollY <= 50) {
                setHasScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {window.removeEventListener("scroll", handleScroll);}
    }, [hasScrolled]);


    // reset scroll tracking when left column appears
    //TODO: Still a little wonky but I am wondering once I fill the right sections out if it'll work
    useEffect(() => {
        if (activeSection?.sectionId !== 'welcome' && !leftColumnVisible) {
            queueMicrotask(() => setLeftColumnVisible(true));
            queueMicrotask( () => setHasScrolled(false));
        }
    }, [activeSection]);

    //Intersection Observer for active section:
    useEffect(() => {
        const timer = setTimeout(() => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const id = entry.target.getAttribute("data-section") as SectionId;
                            const section = SECTIONS.find(s => s.sectionId === id);
                            setActiveSection(section);
                        }
                    });
                },
                {
                    root: null,
                    rootMargin: "-40% 0px -40% 0px",
                    threshold: 0,
                }
            );

            Object.values(sectionRefs).forEach((ref) => {
                if (ref.current) observer.observe(ref.current);
            });

            return () => observer.disconnect();
        }, 500); // wait 500ms before observing

        return () => clearTimeout(timer);
    }, []);


    return (
        <div>
            {/* Welcome section — always in DOM, always at top */}
            <div
                ref={welcomeSectionRef}
                data-section="welcome"
            >
                <AnimatePresence>
                    {activeSection?.sectionId === 'welcome' && (
                        <motion.div
                            key="welcome"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <WelcomeSection />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Two column layout — always in DOM, always below welcome */}
            <motion.div
                className="flex"
                initial={{ opacity: 0 }}
                animate={{ opacity: activeSection?.sectionId !== 'welcome' ? 1 : 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Left Column Sticky */}
                <div className="sticky top-0 h-screen w-2/5 shrink-0">
                    <LeftColumn
                        activeSection={activeSection}
                        section={sectionRefs}
                        hasScrolled={hasScrolled}
                        leftColumnVisible={leftColumnVisible}
                    />
                </div>

                {/* Right Column Scrollable */}
                <div className="w-3/5 shrink-0">
                    <RightColumn
                        sectionRefs={sectionRefs}
                        githubResponse={githubResponse}
                    />
                </div>
            </motion.div>
        </div>
    )
}