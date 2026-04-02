import { useEffect, useState} from "react";
import LeftColumn from "./LeftColumn.tsx";
import RightColumn from "./RightColumn.tsx";
import WelcomeSection from "./sections/WelcomeSection.tsx";
import {AnimatePresence, motion} from "framer-motion";
import {useGithubRepos} from "../hooks/useGithubRepos.ts";




export default function MainLayout() {
    const [activeSection, setActiveSection] = useState<Element>();
    const [leftColumnVisible, setLeftColumnVisible] = useState<boolean>(false);
    const [dataSections] = useState< NodeListOf<Element>>(document.querySelectorAll('div[data-section]'));
    const githubResponse = useGithubRepos("klambo94", 5);


    useEffect(() => {
        if(activeSection?.getAttribute("data-section") !== 'welcome' && !leftColumnVisible) {
            queueMicrotask(() => setLeftColumnVisible(false));
        }
    }, [activeSection, leftColumnVisible]);



    //Intersection Observer for active section:
    useEffect(() => {
        const timer = setTimeout(() => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setActiveSection(entry.target)
                            console.log("activeSection", entry.target);
                        }
                    });
                },
                {
                    root: null,
                    threshold: 0
                }
            );

            Object.values(dataSections).forEach((section) => {
                observer.observe(section);
            });

            return () => observer.disconnect();
        }, 500); // wait 500ms before observing

        return () => clearTimeout(timer);
    }, [dataSections]);


    return (
        <div>
            {/* Welcome section — always in DOM, always at top */}
            <div data-section="welcome">
                <AnimatePresence>
                    <motion.div
                        key="welcome"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <WelcomeSection />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Two column layout — always in DOM, always below welcome */}
            <motion.div
                className="flex"
                initial={{ opacity: 0 }}
                animate={{ opacity: activeSection?.getAttribute("data-section") !== 'welcome' ? 1 : 0 }}
                transition={{ duration: 0.5}}
            >
                {/* Left Column Sticky */}
                <div className="sticky top-0 h-screen w-2/5">
                    <LeftColumn
                        activeSection={activeSection}
                        leftColumnVisible={leftColumnVisible}
                    />
                </div>

                {/* Right Column Scrollable */}
                <div className="w-3/5">
                    <RightColumn
                        githubResponse={githubResponse}
                    />
                </div>
            </motion.div>
        </div>
    )
}