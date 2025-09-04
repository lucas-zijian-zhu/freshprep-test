import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFavoriteRepositories, useToggleFavorite } from '@/hooks/useFavorites';
import { GitHubRepository } from '@/types';

export default function FavoritesScreen() {
  const colorScheme = useColorScheme();
  const {
    data: favoriteRepositories = [],
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useFavoriteRepositories();

  const toggleFavorite = useToggleFavorite();

  const handleRepositoryPress = useCallback((repository: GitHubRepository) => {
    router.push({
      pathname: '/repository/[id]',
      params: { id: repository.id.toString() },
    });
  }, []);

  const handleRemoveFavorite = useCallback((repositoryId: number) => {
    toggleFavorite.mutate({
      repositoryId,
      isFavorite: true,
    });
  }, [toggleFavorite]);

  const renderRepository = useCallback(({ item }: { item: GitHubRepository }) => (
    <FavoriteRepositoryItem
      repository={item}
      onPress={handleRepositoryPress}
      onRemove={handleRemoveFavorite}
      colorScheme={colorScheme as 'light' | 'dark' | null}
    />
  ), [handleRepositoryPress, handleRemoveFavorite, colorScheme]);

  const renderEmpty = useCallback(() => {
    if (isLoading) return null;
    return (
      <ThemedView style={styles.emptyContainer}>
        <Ionicons 
          name="heart-outline" 
          size={64} 
          color={Colors[colorScheme ?? 'light'].tint} 
        />
        <ThemedText type="subtitle" style={styles.emptyTitle}>
          No Favorites Yet
        </ThemedText>
        <ThemedText style={styles.emptyMessage}>
          Start exploring repositories and tap the heart icon to add them to your favorites.
        </ThemedText>
        <TouchableOpacity
          style={[styles.exploreButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
          onPress={() => router.push('/(tabs)/')}
        >
          <ThemedText style={styles.exploreButtonText}>Explore Repositories</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }, [isLoading, colorScheme]);

  if (isError) {
    return (
      <ThemedView style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color={Colors[colorScheme ?? 'light'].tint} />
        <ThemedText type="subtitle" style={styles.errorTitle}>Something went wrong</ThemedText>
        <ThemedText style={styles.errorMessage}>
          Unable to load your favorites. Please try again.
        </ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <ThemedText style={styles.retryButtonText}>Try Again</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>Favorites</ThemedText>
        <ThemedText style={styles.subtitle}>
          {favoriteRepositories.length} {favoriteRepositories.length === 1 ? 'repository' : 'repositories'}
        </ThemedText>
      </ThemedView>

      <FlatList
        data={favoriteRepositories}
        renderItem={renderRepository}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            tintColor={Colors[colorScheme ?? 'light'].tint}
          />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

// Favorite Repository Item Component
interface FavoriteRepositoryItemProps {
  repository: GitHubRepository;
  onPress: (repository: GitHubRepository) => void;
  onRemove: (repositoryId: number) => void;
  colorScheme: 'light' | 'dark' | null;
}

function FavoriteRepositoryItem({ 
  repository, 
  onPress, 
  onRemove, 
  colorScheme 
}: FavoriteRepositoryItemProps) {
  const handleRemovePress = useCallback(() => {
    onRemove(repository.id);
  }, [onRemove, repository.id]);

  return (
    <TouchableOpacity
      style={[styles.repositoryItem, { borderColor: '#e0e0e0' }]}
      onPress={() => onPress(repository)}
      activeOpacity={0.7}
    >
      <View style={styles.repositoryHeader}>
        <View style={styles.repositoryInfo}>
          <ThemedText type="defaultSemiBold" style={styles.repositoryName}>
            {repository.name}
          </ThemedText>
          <ThemedText style={styles.repositoryOwner}>
            by {repository.owner.login}
          </ThemedText>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={handleRemovePress}
        >
          <Ionicons
            name="heart"
            size={24}
            color="#ff6b6b"
          />
        </TouchableOpacity>
      </View>

      {repository.description && (
        <ThemedText style={styles.repositoryDescription} numberOfLines={2}>
          {repository.description}
        </ThemedText>
      )}

      <View style={styles.repositoryStats}>
        <View style={styles.statItem}>
          <Ionicons name="star" size={16} color={Colors[colorScheme ?? 'light'].tint} />
          <ThemedText style={styles.statText}>{repository.stargazers_count.toLocaleString()}</ThemedText>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="git-branch" size={16} color={Colors[colorScheme ?? 'light'].tint} />
          <ThemedText style={styles.statText}>{repository.forks_count.toLocaleString()}</ThemedText>
        </View>
        {repository.language && (
          <View style={styles.statItem}>
            <ThemedText style={styles.languageText}>{repository.language}</ThemedText>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  listContainer: {
    padding: 16,
  },
  repositoryItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  repositoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  repositoryInfo: {
    flex: 1,
    marginRight: 8,
  },
  repositoryName: {
    fontSize: 18,
    marginBottom: 4,
  },
  repositoryOwner: {
    fontSize: 14,
    opacity: 0.7,
  },
  removeButton: {
    padding: 4,
  },
  repositoryDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    opacity: 0.8,
  },
  repositoryStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    fontWeight: '500',
  },
  languageText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
    lineHeight: 20,
  },
  exploreButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});
