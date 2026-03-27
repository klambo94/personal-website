import type { RefObject } from "react";


export type Section = {
    sectionId: SectionId;
    color: string;
    label: string;
}

export type SectionId = 'welcome' | 'work' | 'builder' | 'personal' | 'connect';

export const SECTIONS: Section[] = [
    {sectionId: "welcome", color: '', label: 'Welcome'},
    { sectionId: 'work', color: '', label: 'The Work' },
    { sectionId: 'builder', color: '', label: 'The Builder' },
    { sectionId: 'personal', color: '', label: 'Beyond the Desk' },
    { sectionId: 'connect', color: '', label: "Let's Connect" },
];

export type LeftColumnProps = {
    activeSection: Section | undefined;
    section: Record<SectionId, RefObject<HTMLDivElement | null>>;
    hasScrolled: boolean;
    hoveredCard: CardProps | undefined;
    leftColumnVisible: boolean;

}

export type RightColumnProps = {
    sectionRefs: Record<SectionId, RefObject<HTMLDivElement | null>>;
    onHover: (card: CardProps | undefined) => void;
}

export type CardProps = {
    skills: Skill[];
    name: string;
    description: string;
    isHovered: boolean;
    onHover: (hovered: boolean) => void;
    link: string;
    section: Section;
}

export type Skill = {
    name: string; // Name of skill
    type: string; //type of skill
    sectionIds: string[]; // For dependent on if we show it during that section or not
}

export const SKILL_TYPE = {
    FRAMEWORK: 'Framework',
    LANGUAGE: 'Language',
    TOOLING: 'Tooling',
    DATABASE: 'Database',
    CONCEPT: 'Concept',
    LIBRARY: 'Library',       // React, Jackson — not full frameworks but not languages
    PLATFORM: 'Platform',     // Docker, AWS, Hadoop — infrastructure you run things on
    API: 'API',               // Anthropic API, REST — interface-level skills
    PRACTICE: 'Practice',     // Agile, CI/CD, Code Review, Observability — ways of working
    PERSONAL: 'Personal',
}


export const SKILLS: Skill[] = [
    {name: 'Java', type: SKILL_TYPE.LANGUAGE, sectionIds: ['work']},
    {name: 'Python', type: SKILL_TYPE.LANGUAGE, sectionIds: ['work', 'builder']},
    {name: 'TypeScript', type: SKILL_TYPE.LANGUAGE, sectionIds: ['work', 'builder']},

    {name: 'React', type: SKILL_TYPE.LIBRARY, sectionIds: ['builder']},

    {name: 'Ruby on Rails', type: SKILL_TYPE.FRAMEWORK, sectionIds: ['builder']},
    {name: 'Next.js', type: SKILL_TYPE.FRAMEWORK, sectionIds: ['builder']},
    {name: 'FastAPI', type: SKILL_TYPE.FRAMEWORK, sectionIds: ['builder']},
    {name: 'Spring Boot', type: SKILL_TYPE.FRAMEWORK, sectionIds: ['work']},
    {name: 'RSpec', type: SKILL_TYPE.FRAMEWORK, sectionIds: ['builder'] }, // from Vibecast
    {name: 'JUnit', type: SKILL_TYPE.FRAMEWORK, sectionIds: ['work'] },    // from your resume
    {name: 'Django', type: SKILL_TYPE.FRAMEWORK, sectionIds: ['builder'] },
    {name: 'ZK Framework', type: SKILL_TYPE.FRAMEWORK, sectionIds: ['work'] },
    {name: 'JPA / Hibernate', type: SKILL_TYPE.FRAMEWORK, sectionIds: ['builder'] },
    {name: 'MyBatis', type: SKILL_TYPE.FRAMEWORK, sectionIds: ['work'] },
    {name: 'SQLAlchemy', type: SKILL_TYPE.FRAMEWORK, sectionIds: ['builder'] },

    {name: 'Bash / Shell', type: SKILL_TYPE.TOOLING, sectionIds: ['work', 'builder'] },
    {name: 'Vite', type: SKILL_TYPE.TOOLING, sectionIds: ['builder'] },
    {name: 'Git', type: SKILL_TYPE.TOOLING, sectionIds: ['work', 'builder'] },
    {name: 'GitHub', type: SKILL_TYPE.TOOLING, sectionIds: ['work', 'builder'] },
    {name: 'SVN', type: SKILL_TYPE.TOOLING, sectionIds: ['work', 'builder'] },
    {name: 'Postman', type: SKILL_TYPE.TOOLING, sectionIds: ['work', 'builder'] },
    {name: 'Docker Compose', type: SKILL_TYPE.TOOLING, sectionIds: ['builder'] },
    {name: 'npm / pip', type: SKILL_TYPE.TOOLING, sectionIds: ['work', 'builder'] },
    {name: 'IntelliJ/Idea Products', type: SKILL_TYPE.TOOLING, sectionIds: ['work', 'builder'] },

    {name: 'Linux', type: SKILL_TYPE.PLATFORM, sectionIds: ['work', 'builder'] },
    {name: 'Tomcat', type: SKILL_TYPE.PLATFORM, sectionIds: ['work'] },
    {name: 'Uvicorn', type: SKILL_TYPE.PLATFORM, sectionIds: ['builder'] },
    {name: 'PySpark', type: SKILL_TYPE.PLATFORM, sectionIds: ['work']},
    {name: 'Hadoop', type: SKILL_TYPE.PLATFORM, sectionIds: ['work']},
    {name: 'Docker', type: SKILL_TYPE.PLATFORM, sectionIds: ['builder']},

    {name: 'PostgreSQL', type: SKILL_TYPE.DATABASE, sectionIds: ['work', 'builder']},
    {name: 'OracleSQL', type: SKILL_TYPE.DATABASE, sectionIds: ['work']},
    {name: 'Snowflake', type: SKILL_TYPE.DATABASE, sectionIds: ['work']},

    {name: 'Microservices', type: SKILL_TYPE.CONCEPT, sectionIds: ['work']},
    {name: 'REST APIs', type: SKILL_TYPE.CONCEPT, sectionIds: ['work', 'builder']},
    {name: 'Service-Oriented Architecture', type: SKILL_TYPE.CONCEPT, sectionIds: ['work'] },
    {name: 'Event-Driven Architecture', type: SKILL_TYPE.CONCEPT, sectionIds: ['work'] },
    {name: 'Batch Processing', type: SKILL_TYPE.CONCEPT, sectionIds: ['work'] },
    {name: 'CRUD', type: SKILL_TYPE.CONCEPT, sectionIds: ['work', 'builder'] },

    {name: 'Anthropic API', type: SKILL_TYPE.API, sectionIds: ['builder']},

    {name: 'CI/CD', type: SKILL_TYPE.PRACTICE, sectionIds: ['work']},
    {name: 'Observability', type: SKILL_TYPE.PRACTICE, sectionIds: ['work']},
    {name: 'Code Review', type: SKILL_TYPE.PRACTICE, sectionIds: ['work'] },
    {name: 'Technical Documentation', type: SKILL_TYPE.PRACTICE, sectionIds: ['work', 'builder'] },
    {name: 'Release Coordination', type: SKILL_TYPE.PRACTICE, sectionIds: ['work'] },
    {name: 'System Design', type: SKILL_TYPE.PRACTICE, sectionIds: ['work', 'builder'] },
    {name: 'Unit Testing', type: SKILL_TYPE.PRACTICE, sectionIds: ['work', 'builder'] },
    {name: 'API Design', type: SKILL_TYPE.PRACTICE, sectionIds: ['work', 'builder'] },
    {name: 'Data Modeling', type: SKILL_TYPE.PRACTICE, sectionIds: ['work', 'builder'] },

    {name: 'Guitar', type: SKILL_TYPE.PERSONAL, sectionIds: ['personal']},
    {name: 'TTRPGs', type: SKILL_TYPE.PERSONAL, sectionIds: ['personal']},
    {name: 'Game Master', type: SKILL_TYPE.PERSONAL, sectionIds: ['personal']},
    {name: 'Martial Arts', type: SKILL_TYPE.PERSONAL, sectionIds: ['personal']},
];

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