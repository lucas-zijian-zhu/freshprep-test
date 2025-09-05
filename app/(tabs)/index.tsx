import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useIsFavorite, useToggleFavorite } from '@/hooks/useFavorites';
import { useRepositories } from '@/hooks/useRepositories';
import { GitHubRepository } from '@/types';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [searchQuery, setSearchQuery] = useState('react');
  const [sortBy, setSortBy] = useState<'stars' | 'forks' | 'updated'>('stars');

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useRepositories({
    query: searchQuery,
    per_page: 20,
    sort: sortBy,
    order: 'desc',
  });

  const repositories = data?.pages.flatMap(page => page.items) || [];

  const handleRepositoryPress = useCallback((repository: GitHubRepository) => {
    router.push({
      pathname: '/repository/[id]',
      params: { id: repository.id.toString() },
    });
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderRepository = useCallback(({ item }: { item: GitHubRepository }) => (
    <RepositoryItem
      repository={item}
      onPress={handleRepositoryPress}
      colorScheme={colorScheme as 'light' | 'dark' | null}
    />
  ), [handleRepositoryPress, colorScheme]);

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors[colorScheme ?? 'light'].tint} />
      </View>
    );
  }, [isFetchingNextPage, colorScheme]);

  const renderEmpty = useCallback(() => {
    if (isLoading) return null;
    return (
      <ThemedView style={styles.emptyContainer}>
        <ThemedText>No repositories found. Try a different search term.</ThemedText>
      </ThemedView>
    );
  }, [isLoading]);

  if (isError) {
    return (
      <ThemedView style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color={Colors[colorScheme ?? 'light'].tint} />
        <ThemedText type="subtitle" style={styles.errorTitle}>Something went wrong</ThemedText>
        <ThemedText style={styles.errorMessage}>
          {error instanceof Error ? error.message : 'An unknown error occurred'}
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
        <ThemedText type="subtitle" style={styles.title}>GitHub Repositories</ThemedText>
        
        <View style={styles.searchContainer}>
          <Ionicons 
            name="search" 
            size={20} 
            color={Colors[colorScheme ?? 'light'].text} 
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, { color: Colors[colorScheme ?? 'light'].text }]}
            placeholder="Search repositories..."
            placeholderTextColor={Colors[colorScheme ?? 'light'].text + '80'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            onSubmitEditing={() => refetch()}
          />
        </View>

        <View style={styles.sortContainer}>
          <ThemedText style={styles.sortLabel}>Sort by:</ThemedText>
          <View style={styles.sortButtons}>
            {(['stars', 'forks', 'updated'] as const).map((sort) => (
              <TouchableOpacity
                key={sort}
                style={[
                  styles.sortButton,
                  sortBy === sort && styles.sortButtonActive,
                  { borderColor: Colors[colorScheme ?? 'light'].tint }
                ]}
                onPress={() => setSortBy(sort)}
              >
                <ThemedText
                  style={[
                    styles.sortButtonText,
                    sortBy === sort && styles.sortButtonTextActive
                  ]}
                >
                  {sort.charAt(0).toUpperCase() + sort.slice(1)}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ThemedView>

      <FlatList
        data={repositories}
        renderItem={renderRepository}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
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

// Repository Item Component
interface RepositoryItemProps {
  repository: GitHubRepository;
  onPress: (repository: GitHubRepository) => void;
  colorScheme: 'light' | 'dark' | null;
}

function RepositoryItem({ repository, onPress, colorScheme }: RepositoryItemProps) {
  const toggleFavorite = useToggleFavorite();
  const isFavorite = useIsFavorite(repository.id);

  const handleFavoritePress = useCallback(() => {
    toggleFavorite.mutate({
      repositoryId: repository.id,
      isFavorite,
    });
  }, [toggleFavorite, repository.id, isFavorite]);

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
          style={styles.favoriteButton}
          onPress={handleFavoritePress}
          disabled={toggleFavorite.isPending}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? '#ff6b6b' : Colors[colorScheme ?? 'light'].text}
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
    marginBottom: 16,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  sortContainer: {
    marginBottom: 8,
  },
  sortLabel: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  sortButtonActive: {
    backgroundColor: '#007AFF',
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sortButtonTextActive: {
    color: 'white',
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
  favoriteButton: {
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
  footerLoader: {
    padding: 16,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
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
