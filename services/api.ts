import { GitHubRepository, GitHubSearchResponse, SearchParams } from '@/types';

const GITHUB_API_BASE = 'https://api.github.com';

class GitHubAPI {
  private async fetchWithErrorHandling<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async searchRepositories(params: SearchParams): Promise<GitHubSearchResponse> {
    const searchParams = new URLSearchParams({
      q: params.query,
      page: params.page.toString(),
      per_page: params.per_page.toString(),
      ...(params.sort && { sort: params.sort }),
      ...(params.order && { order: params.order }),
    });

    const url = `${GITHUB_API_BASE}/search/repositories?${searchParams}`;
    return this.fetchWithErrorHandling<GitHubSearchResponse>(url);
  }

  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}`;
    return this.fetchWithErrorHandling<GitHubRepository>(url);
  }

  async getRepositoryById(id: number): Promise<GitHubRepository> {
    const url = `${GITHUB_API_BASE}/repositories/${id}`;
    return this.fetchWithErrorHandling<GitHubRepository>(url);
  }
}

export const githubAPI = new GitHubAPI();
