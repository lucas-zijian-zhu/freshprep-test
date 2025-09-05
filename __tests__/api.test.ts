import { githubAPI } from '../services/api';

// Mock fetch globally
global.fetch = jest.fn();

describe('GitHub API Service', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('searchRepositories', () => {
    it('should fetch repositories with correct parameters', async () => {
      const mockResponse = {
        total_count: 1,
        incomplete_results: false,
        items: [
          {
            id: 1,
            name: 'test-repo',
            full_name: 'test-user/test-repo',
            description: 'A test repository',
            html_url: 'https://github.com/test-user/test-repo',
            stargazers_count: 100,
            forks_count: 10,
            language: 'TypeScript',
            created_at: '2023-01-01T00:00:00Z',
            updated_at: '2023-01-01T00:00:00Z',
            owner: {
              id: 1,
              login: 'test-user',
              avatar_url: 'https://github.com/test-user.png',
              html_url: 'https://github.com/test-user',
            },
          },
        ],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await githubAPI.searchRepositories({
        query: 'test',
        page: 1,
        per_page: 10,
        sort: 'stars',
        order: 'desc',
      });

      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/search/repositories?q=test&page=1&per_page=10&sort=stars&order=desc',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'GitHub-Repo-App/1.0.0',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(
        githubAPI.searchRepositories({
          query: 'test',
          page: 1,
          per_page: 10,
        })
      ).rejects.toThrow('Repository not found.');
    });
  });

  describe('getRepository', () => {
    it('should fetch a single repository', async () => {
      const mockRepository = {
        id: 1,
        name: 'test-repo',
        full_name: 'test-user/test-repo',
        description: 'A test repository',
        html_url: 'https://github.com/test-user/test-repo',
        stargazers_count: 100,
        forks_count: 10,
        language: 'TypeScript',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        owner: {
          id: 1,
          login: 'test-user',
          avatar_url: 'https://github.com/test-user.png',
          html_url: 'https://github.com/test-user',
        },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepository,
      });

      const result = await githubAPI.getRepository('test-user', 'test-repo');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/test-user/test-repo',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'GitHub-Repo-App/1.0.0',
          }),
        })
      );
      expect(result).toEqual(mockRepository);
    });
  });
});
