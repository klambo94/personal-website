import type { RefObject } from "react";


export type Section = {
    sectionId: SectionId;
    color: string;
    label: string;
}

export type SectionId = 'welcome' | 'work' | 'builder' | 'personal' | 'connect';


export type LeftColumnProps = {
    activeSection: Section | undefined;
    section: Record<SectionId, RefObject<HTMLDivElement | null>>;
    hasScrolled: boolean;
    leftColumnVisible: boolean;

}

export type RightColumnProps = {
    sectionRefs: Record<SectionId, RefObject<HTMLDivElement | null>>;
    githubResponse: GithubResponse;
}

export type WorkCardProps =  {
    card: CardProps;
    delay: number;
}

export type WorkDetailProps = {
    card: CardProps;
    visible: boolean;
}

export type Skill = {
    name: string; // Name of skill
    type: string; //type of skill
    sectionIds: string[]; // For dependent on if we show it during that section or not
    companies?: string[];
}

export type CardProps = {
    skills: Skill[];
    name: string;
    description: string;
    link?: string;
    section?: Section;
    awards?: Award[];
    stars?: Star[];
    dates?: string[];
    role?: string;
}
export type GithubResponse = {
    repos: GithubRepo[],
    loading: boolean,
    error: string | null,
}

export type GithubRepo = {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    topics: string[];
    languages: string[] | null;
    updated_at: string | null;
    stargazers_count: number;
}

export type Award = {
    name: string;
    description: string;
    companies?: string[];
}

export type Star = {
    name: string;
    situation: string;
    task: string;
    action: string;
    result: string;
    companies?: string[];
}

export type FormStatus = 'idle' | 'sending' | 'success' | 'error';


export type FormData = {
    name: string;
    subject: string;
    email: string;
    message: string;
}

export type FormErrors = {
    name?: string;
    subject?: string;
    email?: string;
    message?: string;
}