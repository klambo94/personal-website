import {Octokit} from "@octokit/rest";
import {useEffect, useState} from "react";
import type {GithubRepo} from "../types.ts";

const octokit = new Octokit();

export function useGithubRepos(username: string, numOfReposToFetch: number) {
    const [repos, setRepos] = useState<GithubRepo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        async function fetchRepos() {
            try {
                setLoading(true);
                const { data } = await octokit.request('GET /users/{username}/repos', {
                    username: username,
                    sort: 'updated',
                    per_page: numOfReposToFetch,
                    headers: {
                        'X-GitHub-Api-Version': '2026-03-10'
                    },
                })


                const reposWithLanguages = await Promise.all(
                    data.map(async (repo) => {
                        const { data: languages } = await octokit.rest.repos.listLanguages({
                            owner: username,
                            repo: repo.name,
                        });

                        return {
                            id: repo.id,
                            name: repo.name,
                            description: repo.description,
                            html_url: repo.html_url,
                            topics: repo.topics ?? [],
                            languages: Object.keys(languages),
                            updated_at: repo.updated_at ?? null,
                            stargazers_count: repo.stargazers_count ?? 0,
                        };
                    })
                );

                setRepos(reposWithLanguages);
            } catch (err) {
                setError("Failed to fetch repos");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchRepos();
    }, [username]);
    return { repos, loading, error };
}