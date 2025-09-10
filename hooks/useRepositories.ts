import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { githubAPI } from '../services/api';
import { SearchParams } from '../types';

// Query keys
export const repositoryKeys = {
  all: ['repositories'] as const,
  searches: () => [...repositoryKeys.all, 'search'] as const,
  search: (params: SearchParams) => [...repositoryKeys.searches(), params] as const,
  details: () => [...repositoryKeys.all, 'detail'] as const,
  detail: (id: number) => [...repositoryKeys.details(), id] as const,
  favorites: () => [...repositoryKeys.all, 'favorites'] as const,
};

// Search repositories with infinite scroll
export function useRepositories(params: Omit<SearchParams, 'page'>) {
  return useInfiniteQuery({
    queryKey: repositoryKeys.search({ ...params, page: 1 }),
    queryFn: async ({ pageParam = 1 }) => {
      const result = await githubAPI.searchRepositories({
        ...params,
        page: pageParam,
      });
      return {
        ...result,
        page: pageParam,
        hasNextPage: result.items.length === params.per_page,
      };
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
  });
}

// Get single repository by ID
export function useRepository(id: number) {
  return useQuery({
    queryKey: repositoryKeys.detail(id),
    queryFn: () => githubAPI.getRepositoryById(id),
    enabled: !!id,
  });
}

// Get single repository by owner/repo
export function useRepositoryByOwner(owner: string, repo: string) {
  return useQuery({
    queryKey: repositoryKeys.detail(`${owner}/${repo}`),
    queryFn: () => githubAPI.getRepository(owner, repo),
    enabled: !!(owner && repo),
  });
}
