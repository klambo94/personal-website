import type {Award, CardProps, Section, Skill, Star} from "./types.ts";

export const SECTIONS: Section[] = [
    {sectionId: "welcome", color: '', label: 'Welcome'},
    { sectionId: 'work', color: '', label: 'The Work' },
    { sectionId: 'builder', color: '', label: 'The Builder' },
    { sectionId: 'personal', color: '', label: 'Beyond the Desk' },
    { sectionId: 'connect', color: '', label: "Let's Connect" },
];
export const SKILL_TYPE = {
    FRAMEWORK: 'Framework',
    LANGUAGE: 'Language',
    TOOLING: 'Tooling',
    DATABASE: 'Database',
    CONCEPT: 'Concept',
    LIBRARY: 'Library',
    PLATFORM: 'Platform',
    API: 'API',
    PRACTICE: 'Practice',
    PERSONAL: 'Personal',
}

export const COMPANY_PROPS : Record<string, string> = {
    CIRCANA: 'Circana',
    RECONDO: 'Recondo',
}


export const SKILLS: Skill[] = [
    {name: 'Java', type: SKILL_TYPE.LANGUAGE, sectionIds: ['work'], companies: [COMPANY_PROPS.CIRCANA, COMPANY_PROPS.RECONDO]},
    {name: 'Python', type: SKILL_TYPE.LANGUAGE, sectionIds: ['work', 'builder']},
    {name: 'Ruby', type: SKILL_TYPE.LANGUAGE, sectionIds: ['builder']},
    {name: 'TypeScript', type: SKILL_TYPE.LANGUAGE, sectionIds: ['builder']},
    {name: 'JavaScript', type: SKILL_TYPE.LANGUAGE, sectionIds: ['builder']},

    {name: 'React', type: SKILL_TYPE.LIBRARY, sectionIds: ['builder']},

    {name: 'Ruby on Rails', type: SKILL_TYPE.FRAMEWORK, sectionIds: ['builder']},
    {name: 'Next.js', type: SKILL_TYPE.FRAMEWORK, sectionIds: ['builder']},
    {name: 'FastAPI', type: SKILL_TYPE.FRAMEWORK, sectionIds: ['builder']},
    {name: 'Spring Boot', type: SKILL_TYPE.FRAMEWORK, sectionIds: ['work'], companies: [COMPANY_PROPS.CIRCANA, COMPANY_PROPS.RECONDO]},
    {name: 'RSpec', type: SKILL_TYPE.FRAMEWORK, sectionIds: ['builder'] },
    {name: 'JUnit', type: SKILL_TYPE.FRAMEWORK, sectionIds: ['work'], companies: [COMPANY_PROPS.CIRCANA, COMPANY_PROPS.RECONDO]},
    {name: 'Django', type: SKILL_TYPE.FRAMEWORK, sectionIds: ['builder'] },
    {name: 'ZK Framework', type: SKILL_TYPE.FRAMEWORK, sectionIds: ['work'], companies: [COMPANY_PROPS.CIRCANA] },
    {name: 'JPA / Hibernate', type: SKILL_TYPE.FRAMEWORK, sectionIds: ['builder'] },
    {name: 'MyBatis', type: SKILL_TYPE.FRAMEWORK, sectionIds: ['work'], companies: [COMPANY_PROPS.CIRCANA]  },
    {name: 'SQLAlchemy', type: SKILL_TYPE.FRAMEWORK, sectionIds: ['builder'] },

    {name: 'Bash / Shell', type: SKILL_TYPE.TOOLING, sectionIds: ['work', 'builder'], companies: [COMPANY_PROPS.CIRCANA, COMPANY_PROPS.RECONDO]  },
    {name: 'Vite', type: SKILL_TYPE.TOOLING, sectionIds: ['builder'] },
    {name: 'Git', type: SKILL_TYPE.TOOLING, sectionIds: ['work', 'builder'], companies: [COMPANY_PROPS.CIRCANA]  },
    {name: 'GitHub', type: SKILL_TYPE.TOOLING, sectionIds: ['work', 'builder'], companies: [COMPANY_PROPS.CIRCANA]  },
    {name: 'SVN', type: SKILL_TYPE.TOOLING, sectionIds: ['work', 'builder'], companies: [COMPANY_PROPS.CIRCANA, COMPANY_PROPS.RECONDO]  },
    {name: 'Postman', type: SKILL_TYPE.TOOLING, sectionIds: ['work', 'builder'], companies: [COMPANY_PROPS.CIRCANA]  },
    {name: 'Docker Compose', type: SKILL_TYPE.TOOLING, sectionIds: ['builder'] },
    {name: 'npm / pip', type: SKILL_TYPE.TOOLING, sectionIds: ['work', 'builder'] },
    {name: 'IntelliJ/Idea Products', type: SKILL_TYPE.TOOLING, sectionIds: ['work', 'builder'], companies: [COMPANY_PROPS.CIRCANA, COMPANY_PROPS.RECONDO]  },

    {name: 'Linux', type: SKILL_TYPE.PLATFORM, sectionIds: ['work', 'builder'], companies: [COMPANY_PROPS.CIRCANA, COMPANY_PROPS.RECONDO]  },
    {name: 'Tomcat', type: SKILL_TYPE.PLATFORM, sectionIds: ['work'], companies: [COMPANY_PROPS.CIRCANA]  },
    {name: 'Uvicorn', type: SKILL_TYPE.PLATFORM, sectionIds: ['builder'] },
    {name: 'PySpark', type: SKILL_TYPE.PLATFORM, sectionIds: ['work'], companies: [COMPANY_PROPS.CIRCANA] },
    {name: 'Hadoop', type: SKILL_TYPE.PLATFORM, sectionIds: ['work'], companies: [COMPANY_PROPS.CIRCANA] },
    {name: 'Docker', type: SKILL_TYPE.PLATFORM, sectionIds: ['builder']},

    {name: 'PostgreSQL', type: SKILL_TYPE.DATABASE, sectionIds: ['builder']},
    {name: 'OracleSQL', type: SKILL_TYPE.DATABASE, sectionIds: ['work'], companies: [COMPANY_PROPS.CIRCANA] },
    {name: 'Snowflake', type: SKILL_TYPE.DATABASE, sectionIds: ['work'], companies: [COMPANY_PROPS.CIRCANA] },

    {name: 'Microservices', type: SKILL_TYPE.CONCEPT, sectionIds: ['work'], companies: [COMPANY_PROPS.CIRCANA, COMPANY_PROPS.RECONDO] },
    {name: 'REST APIs', type: SKILL_TYPE.CONCEPT, sectionIds: ['work', 'builder'], companies: [COMPANY_PROPS.CIRCANA] },
    {name: 'Service-Oriented Architecture', type: SKILL_TYPE.CONCEPT, sectionIds: ['work'] , companies: [COMPANY_PROPS.CIRCANA] },
    {name: 'Event-Driven Architecture', type: SKILL_TYPE.CONCEPT, sectionIds: ['work'], companies: [COMPANY_PROPS.CIRCANA, COMPANY_PROPS.RECONDO]  },
    {name: 'Batch Processing', type: SKILL_TYPE.CONCEPT, sectionIds: ['work'], companies: [COMPANY_PROPS.CIRCANA, COMPANY_PROPS.RECONDO]  },
    {name: 'CRUD', type: SKILL_TYPE.CONCEPT, sectionIds: ['work', 'builder'] },

    {name: 'Anthropic API', type: SKILL_TYPE.API, sectionIds: ['builder']},

    {name: 'CI/CD', type: SKILL_TYPE.PRACTICE, sectionIds: ['work'], companies: [COMPANY_PROPS.CIRCANA, COMPANY_PROPS.RECONDO] },
    {name: 'Observability', type: SKILL_TYPE.PRACTICE, sectionIds: ['work'], companies: [COMPANY_PROPS.CIRCANA] },
    {name: 'Code Review', type: SKILL_TYPE.PRACTICE, sectionIds: ['work'] , companies: [COMPANY_PROPS.CIRCANA, COMPANY_PROPS.RECONDO] },
    {name: 'Technical Documentation', type: SKILL_TYPE.PRACTICE, sectionIds: ['work', 'builder'], companies: [COMPANY_PROPS.CIRCANA, COMPANY_PROPS.RECONDO]  },
    {name: 'Release Coordination', type: SKILL_TYPE.PRACTICE, sectionIds: ['work'], companies: [COMPANY_PROPS.CIRCANA, COMPANY_PROPS.RECONDO]  },
    {name: 'System Design', type: SKILL_TYPE.PRACTICE, sectionIds: ['work', 'builder'], companies: [COMPANY_PROPS.CIRCANA] },
    {name: 'Unit Testing', type: SKILL_TYPE.PRACTICE, sectionIds: ['work', 'builder'], companies: [COMPANY_PROPS.CIRCANA, COMPANY_PROPS.RECONDO]  },
    {name: 'API Design', type: SKILL_TYPE.PRACTICE, sectionIds: ['work', 'builder'],companies: [COMPANY_PROPS.CIRCANA] },
    {name: 'Data Modeling', type: SKILL_TYPE.PRACTICE, sectionIds: ['work', 'builder'], companies: [COMPANY_PROPS.CIRCANA]},

    {name: 'Guitar', type: SKILL_TYPE.PERSONAL, sectionIds: ['personal']},
    {name: 'TTRPGs', type: SKILL_TYPE.PERSONAL, sectionIds: ['personal']},
    {name: 'Game Master', type: SKILL_TYPE.PERSONAL, sectionIds: ['personal']},
    {name: 'Martial Arts', type: SKILL_TYPE.PERSONAL, sectionIds: ['personal']},
];

export const AWARDS: Award[] = [
    {name: 'Growth Award', companies: [COMPANY_PROPS.CIRCANA], description: 'Stepped up to own UI development responsibilities during a period of team attrition, ensuring continuity of delivery with no disruption to project timelines.'},
    {name: 'Growth Award x 2', companies: [COMPANY_PROPS.CIRCANA], description: 'Consistently took on high-complexity projects under tight deadlines, delivering quality outcomes through strong technical execution and initiative.'},
    {name: 'Inclusion Award', companies: [COMPANY_PROPS.CIRCANA], description: 'Engineered consolidated SAS reports that replaced multiple redundant client-run services with a single unified report, reducing client operational workload by approximately 10x.'},
    {name: 'Courage Award', companies: [COMPANY_PROPS.CIRCANA], description: 'Took ownership of software release coordination responsibilities, overseeing deployment pipelines and post-release monitoring to ensure reliable, low-risk production releases.'},
    {name: 'Trust & Accountability Award', companies: [COMPANY_PROPS.CIRCANA], description: 'Delivered a Client Delivery report enabling stakeholders to track work delivered to clients and associated revenue, improving visibility and accountability across client-facing teams.'},


]

export const STARS: Star[] = [
    {
        name: 'UI Ownership During Team Attrition',
        situation: 'Our engineering team lost several UI-focused engineers in a short period, leaving frontend delivery responsibilities without clear ownership during an active project. ',
        task: 'As a primarily backend engineer, I needed to step up and own frontend delivery to prevent missing timelines and stakeholder disrupti',
        action: 'I got up to speed quickly on the ZK Framework, took full ownership of the frontend app, coordinated with the remaining team members, and managed delivery end-to-end through completion. ',
        result: 'The project was delivered on time with no disruption to stakeholders, and I demonstrated that I could own an unfamiliar part of the stack under pressure without compromising quality.',
        companies: [COMPANY_PROPS.CIRCANA],
    },{
        name: 'Designing and Building Bulk SaaS Reports',
        situation: 'A full-stack reporting platform where users submit reports through a UI portal. Backend processing engines handle CPU and memory intensive business logic asynchronously via a shared queue and worker pool. The processing layer was a known bottleneck — workloads were bursty, job runtimes varied significantly, and worker saturation could cascade into broader system degradation. The platform needed to support both interactive user-initiated reports and batch workloads without starving either.',
        task: 'Design and implement a Bulk Report feature allowing users to submit multiple reports in a single action, without worsening existing bottlenecks or impacting interactive report performance. I  owned the full system design and implementation.',
        action: 'Designed a parent-child orchestration model where a single bulk submission creates a parent job that expands into multiple child report jobs. Built a dedicated application-layer handler to generate child jobs based on user-selected metrics while maintaining clear parent-child relationships for tracking and observability. Introduced job prioritization so bulk jobs run at lower priority, preserving responsiveness for interactive reports. I made a deliberate error-handling trade-off: individual child failures are logged and surfaced, but the overall bulk job succeeds if at least one report completes, avoiding unnecessary failure of large batch runs due to isolated errors. All of this without introducing significant infrastructure.',
        result: 'Bulk report generation was enabled without exacerbating existing bottlenecks. Interactive report responsiveness was preserved during peak usage. Queue saturation risk was reduced, observability into batch execution improved through parent-child tracking, and a scalable foundation for future batch processing was delivered within existing system constraints.',
        companies: [COMPANY_PROPS.CIRCANA],
    },{
        name: 'New Quarterly Bulk Target Report UI for Clients instead of Developers',
        situation: 'A high-maintenance quarterly report that required direct developer involvement every quarter to execute. The process was non-standard, involving significant manual configuration and multiple steps to kick off. Initially only I knew how to run it, which created a single point of failure on the team.',
        task: 'Reduce the operational burden on the dev and support team by transitioning ownership of the report to the client — without disrupting their workflow or requiring ongoing developer oversight.',
        action: 'First, trained a teammate on the manual execution process to distribute the knowledge and reduce the single point of failure. Then, once the Bulk Report feature was in place and provided the proper infrastructure foundation, I scoped out a full frontend report page during downtime and built it in a maintained branch. The new UI exposed the report configuration and submission directly to the client in a clean, self-service interface. Once approved, deployment was seamless since the work was already production-ready.',
        result: 'The quarterly report was fully handed off to the client. What previously required a developer to manually configure and execute each quarter is now self-managed by the client with little to no dev team involvement, freeing up developer and support time for higher value work.',
        companies: [COMPANY_PROPS.CIRCANA],
    },
]


export const WORK_CARDS: CardProps[] = [
    {
        name: "Circana",
        role: "Senior Software Engineer",
        description: 'I have spent several years owning backend services, APIs, and full-stack features end-to-end. Most recently contributing to a platform migration from Java and Spring Boot to Python, PySpark, and Hadoop.',
        skills: SKILLS.filter((skill) => skill.sectionIds.includes('work')
            && skill.companies?.includes(COMPANY_PROPS.CIRCANA)),
        dates: ["Feb 2019", "Present"],
        awards: AWARDS.filter((award) => award.companies?.includes(COMPANY_PROPS.CIRCANA)),
        stars: STARS.filter((star) => star.companies?.includes(COMPANY_PROPS.CIRCANA)),
    }, {
        name: 'Recondo',
        role: "Software Developer",
        dates: ["Nov 2015", "July 2018"],
        description: 'I built Java-based automation bots using Selenium WebDriver to extract patient claim and authorization data from health insurance web portals, collaborated with business analysts to refine requirements, and supported reliable deployments through hands-on DevOps work.',
        skills: SKILLS.filter((skill) => skill.sectionIds.includes('work')
        && skill.companies?.includes(COMPANY_PROPS.RECONDO)),
    }
]