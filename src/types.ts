export type Section = {
    sectionId: SectionId;
    color: string;
    label: string;
}

export type SectionId = 'work' | 'builder' | 'personal' | 'connect';

export const SECTIONS: Section[] = [
    { sectionId: 'work', color: '', label: 'The Work' },
    { sectionId: 'builder', color: '', label: 'The Builder' },
    { sectionId: 'personal', color: '', label: 'Beyond the Desk' },
    { sectionId: 'connect', color: '', label: "Let's Connect" },
];

export type LeftColumnProps = {
    activeSection: Section | undefined;
    section: Record<SectionId, React.RefObject<HTMLDivElement | null>>;
    hasScrolled: boolean;
}