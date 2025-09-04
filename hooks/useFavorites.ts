import { favoritesService } from '@/services/favorites';
import { GitHubRepository } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { repositoryKeys } from './useRepositories';

// Get all favorite repository IDs
export function useFavorites() {
  return useQuery({
    queryKey: repositoryKeys.favorites(),
    queryFn: () => favoritesService.getFavorites(),
    staleTime: 0, // Always refetch favorites
  });
}

// Get favorite repositories with full data
export function useFavoriteRepositories() {
  const queryClient = useQueryClient();
  const { data: favoriteIds = [], ...favoritesQuery } = useFavorites();

  // Get cached repository data for each favorite ID
  const favoriteRepositories = favoriteIds
    .map(id => {
      const cachedData = queryClient.getQueryData<GitHubRepository>(repositoryKeys.detail(id));
      return cachedData;
    })
    .filter((repo): repo is GitHubRepository => repo !== undefined);

  // Find IDs that aren't in cache and need to be fetched
  const uncachedIds = favoriteIds.filter(id => 
    !queryClient.getQueryData<GitHubRepository>(repositoryKeys.detail(id))
  );

  // Fetch uncached repositories
  const { data: uncachedRepos = [] } = useQuery({
    queryKey: ['favorites', 'uncached', uncachedIds],
    queryFn: async () => {
      const promises = uncachedIds.map(id => 
        queryClient.fetchQuery({
          queryKey: repositoryKeys.detail(id),
          queryFn: () => import('@/services/api').then(({ githubAPI }) => githubAPI.getRepositoryById(id)),
        })
      );
      return Promise.all(promises);
    },
    enabled: uncachedIds.length > 0,
  });

  // Combine cached and fetched repositories
  const allRepositories = [...favoriteRepositories, ...uncachedRepos];

  return {
    ...favoritesQuery,
    data: allRepositories,
    favoriteIds,
  };
}

// Toggle favorite with optimistic updates
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ repositoryId, isFavorite }: { repositoryId: number; isFavorite: boolean }) => {
      if (isFavorite) {
        await favoritesService.removeFavorite(repositoryId);
      } else {
        await favoritesService.addFavorite(repositoryId);
      }
      return { repositoryId, isFavorite: !isFavorite };
    },
    onMutate: async ({ repositoryId, isFavorite }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: repositoryKeys.favorites() });

      // Snapshot the previous value
      const previousFavorites = queryClient.getQueryData<number[]>(repositoryKeys.favorites());

      // Optimistically update the favorites list
      queryClient.setQueryData<number[]>(repositoryKeys.favorites(), (old = []) => {
        if (isFavorite) {
          return old.filter(id => id !== repositoryId);
        } else {
          return [...old, repositoryId];
        }
      });

      // Return a context object with the snapshotted value
      return { previousFavorites };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousFavorites) {
        queryClient.setQueryData(repositoryKeys.favorites(), context.previousFavorites);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: repositoryKeys.favorites() });
    },
  });
}

// Check if a specific repository is favorited
export function useIsFavorite(repositoryId: number) {
  const { data: favorites = [] } = useFavorites();
  return favorites.includes(repositoryId);
}
