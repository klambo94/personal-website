import { useEffect, useRef, useState} from "react";
import {type Section, type SectionId, SECTIONS} from "../types.ts";
import LeftColumn from "./LeftColumn.tsx";
import type { RefObject } from "react";



export default function MainLayout() {
    const [activeSection, setActiveSection] = useState<Section | undefined>(undefined);
    const[hasScrolled, setHasScrolled] = useState<boolean>(false);

    const workSectionRef = useRef<HTMLDivElement>(null);
    const builderSectionRef = useRef<HTMLDivElement>(null);
    const personalSectionRef = useRef<HTMLDivElement>(null);
    const connectSectionRef = useRef<HTMLDivElement>(null);

    const sectionRefs: Record<SectionId, RefObject<HTMLDivElement | null>> = {
        work: workSectionRef,
        builder: builderSectionRef,
        personal: personalSectionRef,
        connect: connectSectionRef,
    };

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


    //Intersection Observer for active section:
    useEffect(() => {
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
    }, []);


    return (
        <div className="flex min-h-screen">
            {/*Left Column Sticky*/}
            <div className="sticky top-0 h-screen w-2/5 shrink-0">
                <LeftColumn activeSection={activeSection}
                            section={sectionRefs}
                            hasScrolled={hasScrolled} />

            </div>
        </div>
    )
}