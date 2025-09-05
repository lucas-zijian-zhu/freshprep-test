import { GitHubRepository, GitHubSearchResponse, SearchParams } from '@/types';

const GITHUB_API_BASE = 'https://api.github.com';

class GitHubAPI {
  private async fetchWithErrorHandling<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GitHub-Repo-App/1.0.0',
        },
      });
      
      if (!response.ok) {
        let errorMessage = `GitHub API error: ${response.status} ${response.statusText}`;
        
        // Handle specific error cases
        if (response.status === 403) {
          errorMessage = 'API rate limit exceeded. Please try again later.';
        } else if (response.status === 422) {
          errorMessage = 'Invalid search parameters. Please check your search query.';
        } else if (response.status === 404) {
          errorMessage = 'Repository not found.';
        } else if (response.status === 0) {
          errorMessage = 'Network error. Please check your internet connection.';
        }
        
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      }
      
      throw error;
    }
  }

  async searchRepositories(params: SearchParams): Promise<GitHubSearchResponse> {
    // Validate search parameters
    if (!params.query || params.query.trim() === '') {
      throw new Error('Search query cannot be empty');
    }
    
    if (params.per_page > 100) {
      throw new Error('Per page cannot exceed 100');
    }
    
    const searchParams = new URLSearchParams({
      q: params.query.trim(),
      page: params.page.toString(),
      per_page: Math.min(params.per_page, 100).toString(),
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
