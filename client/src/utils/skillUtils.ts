import type {GithubRepo, Skill} from "../types.ts";

const GIT_LANG_TO_SKILL : Record<string, string> = {
    "Dockerfile": "Docker",
    "Ruby": "Ruby on Rails",
    "Shell": "Bash/Shell scripting",
}
export function extractUniqueLanguages(repos: GithubRepo[]): (string | null)[] {
    const all = repos.flatMap((repo => repo.languages));
    return [...new Set(all)];
}



// export function mapLanguagesToSkills(languages: string[]): Skill[] {
//     const mapped: Skill[] = [];
//     const seen: Set<string>;
//
//     languages.forEach((lang) => {
//         if(!seen.has(lang)) {
//             Skill newSkill = createSkill(lang);
//         }
//     })
// }
//
// export function createSkill(lang: string): Skill {
//
// }